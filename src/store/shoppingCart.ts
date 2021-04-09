import { Course } from '@thinc-org/chula-courses'
import { action, computed, makeObservable, observable } from 'mobx'
import { computedFn } from 'mobx-utils'

export interface ShoppingCartItem extends Course {
  selectedSectionNo: string
  isSelected: boolean
}

export type ShoppingCartState = 'default' | 'delete'

export interface ShoppingCartProps {
  shopItems: ShoppingCartItem[]
  state: ShoppingCartState
}

export class ShoppingCartStore implements ShoppingCartProps {
  @observable shopItems: ShoppingCartItem[] = []
  @observable state: ShoppingCartState = 'default'

  constructor() {
    makeObservable(this)
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
   * Use to convert ShoppingCartItem to Course
   * @param shopItem - the store's item
   */
  private convertToCourse(shopItem: ShoppingCartItem): Course {
    const { selectedSectionNo, isSelected, ...rest } = shopItem // eslint-disable-line
    return rest
  }

  /**
   * Use to get the shopping item by given courseNo.
   * @param courseNo - the unique course number
   */
  item = computedFn((courseNo: string): ShoppingCartItem | undefined => {
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == courseNo)
    if (foundIndex != -1) return this.shopItems[foundIndex]
    return undefined
  })

  /**
   * Use to add interested course to the store
   * @param course - the chula's course
   * @param selectedSectionNo - the selected section of the course
   */
  @action
  addItem(course: Course, selectedSectionNo?: string): void {
    if (!selectedSectionNo) selectedSectionNo = this.findFirstSectionNo(course)
    const newItem: ShoppingCartItem = { ...course, selectedSectionNo, isSelected: false }
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == course.courseNo)
    if (foundIndex != -1) this.shopItems[foundIndex] = newItem
    else this.shopItems.push(newItem)
  }

  /**
   * Use to select or deselect the items; select for removing the item from the store.
   * @param courseNo - the unique course number
   */
  @action
  toggleSelectedItem(courseNo: string): void {
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == courseNo)
    if (foundIndex == -1) return
    this.shopItems[foundIndex].isSelected = !this.shopItems[foundIndex].isSelected
    let hasSelectedItem = false
    this.shopItems.forEach((item) => {
      hasSelectedItem = hasSelectedItem || item.isSelected
    })
    this.state = hasSelectedItem ? 'delete' : 'default'
  }

  /**
   * Use to remove all selected items
   */
  @action
  removeItems(): void {
    if (this.state === 'default') return
    this.shopItems = this.shopItems.filter((item) => item.isSelected === false)
    this.state = 'default'
  }

  /**
   * Use to swap the order of two courses
   * @param courseNoA - the unique courseA number
   * @param courseNoB - the unique courseB number
   */
  @action
  swapOrder(courseNoA: string, courseNoB: string) {
    const indexA = this.shopItems.findIndex((item) => item.courseNo == courseNoA)
    const indexB = this.shopItems.findIndex((item) => item.courseNo == courseNoB)
    if (indexA == -1 || indexB == -1) return
    const temp = this.shopItems[indexA]
    this.shopItems[indexA] = this.shopItems[indexB]
    this.shopItems[indexB] = temp
  }

  /**
   * get one course by the given courseNo. from the store
   * @param courseNo - the unique course number
   */
  course = computedFn((courseNo: string): Course | undefined => {
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == courseNo)
    if (foundIndex == -1) return
    return this.convertToCourse(this.shopItems[foundIndex])
  })

  /**
   * get all course from the store
   */
  @computed
  get courses(): Course[] {
    return this.shopItems.map((item) => this.convertToCourse(item))
  }
}
