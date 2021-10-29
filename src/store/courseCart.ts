import { Course, Semester, StudyProgram } from '@thinc-org/chula-courses'
import { BroadcastChannel } from 'broadcast-channel'
import { action, makeObservable, observable, runInAction } from 'mobx'
import { computedFn } from 'mobx-utils'

import { CourseGroup } from '@/common/hooks/useCourseGroup/types'
import { Storage } from '@/common/storage'
import { StorageKey } from '@/common/storage/constants'
import { client } from '@/services/apollo'
import { GetCourseResponse, GetCourseVars, GET_COURSE } from '@/services/apollo/query/getCourse'
import { GET_COURSE_CART, MODIFY_COURSE_CART } from '@/services/apollo/query/user'
import { collectLogEvent, collectErrorLog } from '@/services/logging'
import { userStore } from '@/store/userStore'

export interface CourseCartItem extends Course {
  selectedSectionNo: string
  isSelected: boolean
  isHidden: boolean
}

export type CourseCartState = 'default' | 'delete'

export interface CourseCartProps {
  shopItems: CourseCartItem[]
  shopItemsByCourseGroup(courseGroup: CourseGroup): CourseCartItem[]
  state: CourseCartState
}

export interface CourseKey {
  courseNo: string
  studyProgram: StudyProgram
  academicYear: string
  semester: string
}

interface CourseCartStoreItem {
  studyProgram: string
  academicYear: string
  courseNo: string
  semester: string
  selectedSectionNo: string
}

export interface CourseCartStore {
  syncToStore(items: CourseCartStoreItem[]): Promise<void>
  syncFromStore(): Promise<CourseCartStoreItem[]>
  online: boolean
}

class DummyCourseCartStore implements CourseCartStore {
  online = false

  async syncFromStore() {
    return []
  }
  async syncToStore() {
    return
  }
}

class LocalStorageCourseCartStore implements CourseCartStore {
  online = false

  async syncToStore(items: CourseCartStoreItem[]) {
    new Storage('localStorage').set(StorageKey.ShoppingCart, items)
  }

  async syncFromStore() {
    return new Storage('localStorage').get<CourseCartItem[]>(StorageKey.ShoppingCart) || []
  }
}

class OnlineCourseCartStore implements CourseCartStore {
  online = true

  async syncToStore(items: CourseCartStoreItem[]) {
    await client.mutate({ mutation: MODIFY_COURSE_CART, variables: { items } })
  }

  async syncFromStore() {
    const { data } = await client.query<{ courseCart: CourseCartStoreItem[] }>({
      query: GET_COURSE_CART,
      fetchPolicy: 'network-only',
    })
    return data.courseCart
  }
}

export enum CourseCartSyncState {
  SYNCING,
  SYNCED,
  FAIL,
  OFFLINE,
}

const unknownCourse: Course = {
  studyProgram: 'S',
  semester: '1',
  academicYear: '0',
  courseNo: 'UNK',
  abbrName: 'UNK',
  courseNameTh: 'UNK',
  courseNameEn: 'UNK',
  faculty: 'UNK',
  department: 'UNK',
  credit: -1,
  creditHours: 'UNK',
  courseCondition: 'UNK',
  genEdType: 'NO',
  sections: [],
}

export class CourseCart implements CourseCartProps {
  @observable shopItems: CourseCartItem[] = []
  @observable state: CourseCartState = 'default'
  @observable source: CourseCartStore = new DummyCourseCartStore()
  @observable syncState: CourseCartSyncState = CourseCartSyncState.OFFLINE
  private channel: BroadcastChannel
  constructor() {
    const COURSE_CART_CHANGES_CHANNEL = 'coursecart-change'
    this.channel = new BroadcastChannel(COURSE_CART_CHANGES_CHANNEL)
    this.channel.onmessage = () => this.pullFromStore()

    makeObservable(this)
  }

  @action
  async upgradeSource() {
    if (userStore.accessToken !== null) {
      this.source = new OnlineCourseCartStore()
      this.syncState = CourseCartSyncState.SYNCING
    } else if (localStorage) {
      this.source = new LocalStorageCourseCartStore()
      this.syncState = CourseCartSyncState.OFFLINE
    } else {
      this.source = new DummyCourseCartStore()
      this.syncState = CourseCartSyncState.OFFLINE
    }
    await this.pullFromStore()
  }

  private async pullFromStore() {
    runInAction(() => {
      if (this.source.online) this.syncState = CourseCartSyncState.SYNCING
    })
    try {
      const courses = await this.source.syncFromStore()
      const fullCourses: (Course & { selectedSectionNo: string })[] = []
      for (const course of courses) {
        let detail
        try {
          const { data } = await client.query<GetCourseResponse, GetCourseVars>({
            query: GET_COURSE,
            variables: {
              courseNo: course.courseNo,
              courseGroup: {
                academicYear: course.academicYear,
                studyProgram: course.studyProgram as StudyProgram,
                semester: course.semester,
              },
            },
          })
          detail = { ...data.course, selectedSectionNo: course.selectedSectionNo }
        } catch (e) {
          detail = {
            ...unknownCourse,
            selectedSectionNo: course.selectedSectionNo,
            studyProgram: course.studyProgram as StudyProgram,
            semester: course.semester as Semester,
            academicYear: course.academicYear,
            courseNo: course.courseNo,
          }
        }
        fullCourses.push(detail)
      }
      runInAction(() => {
        this.shopItems = fullCourses.map((course) => ({ ...course, isSelected: false, isHidden: false }))
      })
      setTimeout(
        action('Delayed sync icon', () => {
          if (this.source.online) this.syncState = CourseCartSyncState.SYNCED
        }),
        1000
      )
    } catch (e) {
      collectErrorLog('Fail to pull course cart', e)
      console.error('Fail to pull course cart', e)
      runInAction(() => {
        if (this.source.online) this.syncState = CourseCartSyncState.FAIL
      })
    }
  }

  private async onChange() {
    runInAction(() => {
      if (this.source.online) this.syncState = CourseCartSyncState.SYNCING
    })
    try {
      await this.source.syncToStore(
        this.shopItems.map((item) => ({
          studyProgram: item.studyProgram,
          academicYear: item.academicYear,
          semester: item.semester,
          courseNo: item.courseNo,
          selectedSectionNo: item.selectedSectionNo,
        }))
      )
      setTimeout(
        action('Delayed sync icon', () => {
          if (this.source.online) this.syncState = CourseCartSyncState.SYNCED
        }),
        1000
      )
    } catch (e) {
      collectErrorLog('Fail to push course cart', e)
      console.error('Fail to push course cart', e)
      runInAction(() => {
        if (this.source.online) this.syncState = CourseCartSyncState.FAIL
      })
    }
    setTimeout(() => this.channel.postMessage('sync'), 1000)
  }

  /**
   * Use to find the first section of given course
   * @param {Course} course - the chula's course
   */
  private findFirstSectionNo(course: Course) {
    const sections = course.sections.sort((sectionA, sectionB) => (sectionA.sectionNo < sectionB.sectionNo ? -1 : 1))
    return sections[0].sectionNo
  }

  /**
   * Use to get the shopping item by given courseNo.
   * @param courseNo - the unique course number
   */
  item = computedFn((course: CourseKey): CourseCartItem | undefined => {
    const foundIndex = this.shopItems.findIndex((item) => isSameKey(item, course))
    if (foundIndex != -1) return this.shopItems[foundIndex]
    return undefined
  })

  /**
   * Use to add interested course to the store
   * @param course - the chula's course
   * @param selectedSectionNo - the selected section of the course
   */
  @action
  addItem(course: Course, selectedSectionNo?: string) {
    // TO DO: remove and use analytics instead
    collectLogEvent({
      kind: 'track',
      message: 'user add course',
      additionalData: {
        courseNo: course.courseNo,
        selectedSectionNo: selectedSectionNo || 'NONE',
        acaedemicYear: course.academicYear,
        semester: course.semester,
        studyProgram: course.studyProgram,
      },
    })

    if (!selectedSectionNo) selectedSectionNo = this.findFirstSectionNo(course)
    const newItem: CourseCartItem = { ...course, selectedSectionNo, isSelected: false, isHidden: false }
    const foundIndex = this.shopItems.findIndex((item) => isSameKey(item, newItem))
    if (foundIndex != -1) this.shopItems[foundIndex] = newItem
    else this.shopItems.push(newItem)

    this.onChange()
    return true
  }

  @action
  removeCourse(course: CourseKey): void {
    this.shopItems = this.shopItems.filter((item) => !isSameKey(item, course))

    this.onChange()
  }

  /**
   * Use to hidden or show the items for timetable.
   * @param courseNo - the unique course number
   */
  @action
  toggleHiddenItem(course: CourseKey): void {
    const foundIndex = this.shopItems.findIndex((item) => isSameKey(item, course))
    if (foundIndex == -1) return
    this.shopItems[foundIndex].isHidden = !this.shopItems[foundIndex].isHidden
  }

  /**
   * Use to remove all selected items
   */
  @action
  removeItems(): void {
    if (this.state === 'default') return
    this.shopItems = this.shopItems.filter((item) => item.isSelected === false)
    this.state = 'default'

    this.onChange()
  }

  @action
  reorder(courseGroup: CourseGroup, from: number, to: number) {
    const items = Array.from(this.shopItems)
    const result = pullCourseGroupUp(items, courseGroup)
    const [removed] = result.splice(from, 1)
    result.splice(to, 0, removed)
    this.shopItems = result
  }

  /**
   * Use to get the shopping item by given courseNo.
   * @param courseNo - the unique course number
   */
  shopItemsByCourseGroup = computedFn((courseGroup: CourseGroup): CourseCartItem[] => {
    return this.shopItems.filter((item) => isInCourseGroup(item, courseGroup))
  })
}

function pullCourseGroupUp(items: CourseCartItem[], courseGroup: CourseGroup): CourseCartItem[] {
  const itemsInCurrentGroup = items.filter((item) => isInCourseGroup(item, courseGroup))
  const itemsInOtherGroups = items.filter((item) => !isInCourseGroup(item, courseGroup))
  return [...itemsInCurrentGroup, ...itemsInOtherGroups]
}

function isSameKey(a: CourseKey, b: CourseKey): boolean {
  return (
    a.courseNo == b.courseNo &&
    a.studyProgram == b.studyProgram &&
    a.semester == b.semester &&
    a.academicYear == b.academicYear
  )
}

function isInCourseGroup(course: CourseKey, courseGroup: CourseGroup): boolean {
  return (
    course.studyProgram == courseGroup.studyProgram &&
    course.semester == courseGroup.semester &&
    course.academicYear == courseGroup.academicYear
  )
}

export const courseCartStore = new CourseCart()
