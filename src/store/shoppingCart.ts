import { sortCourses } from '@/utils/course'
import { Course } from '@thinc-org/chula-courses'
import { action, computed, makeObservable, observable } from 'mobx'
import { computedFn } from 'mobx-utils'

export interface ShoppingCartItem extends Course {
  selectedSectionNo: string
  isSelected: boolean
}

export type ShoppingCartState = 'default' | 'delete'

export interface ShoppingCartProps {
  shopItems: {
    [key: string]: ShoppingCartItem // the key must be `courseNo`
  }
  selectedShopItems: {
    [key: string]: ShoppingCartItem // the key must be `courseNo`
  }
  state: ShoppingCartState
}

export class ShoppingCartStore implements ShoppingCartProps {
  @observable shopItems: { [key: string]: ShoppingCartItem } = {}
  @observable selectedShopItems: { [key: string]: ShoppingCartItem } = {}
  @observable state: ShoppingCartState = 'default'

  constructor() {
    makeObservable(this)
  }

  private createNewItem(course: Course, selectedSectionNo: string): ShoppingCartItem {
    return { ...course, selectedSectionNo, isSelected: false }
  }

  @action
  selectItem(courseNo: string) {
    const shopItem = this.shopItems[courseNo]
    shopItem.isSelected = !shopItem.isSelected
    if (shopItem.isSelected) {
      this.selectedShopItems[shopItem.courseNo] = shopItem
      this.state = 'delete'
    } else {
      delete this.selectedShopItems[shopItem.courseNo]
      this.state = Object.keys(this.selectedShopItems).length == 0 ? 'default' : 'delete'
    }
  }

  @action
  addItem(course: Course, selectedSectionNo: string) {
    const shopItem = this.createNewItem(course, selectedSectionNo)
    this.shopItems[shopItem.courseNo] = shopItem
  }

  @action
  removeItem(courseNo: string) {
    if (this.shopItems[courseNo]) delete this.shopItems[courseNo]
    if (this.selectedShopItems[courseNo]) delete this.selectedShopItems[courseNo]
  }

  @action
  removeAllSelectedItem() {
    Object.keys(this.selectedShopItems).forEach((courseNo) => this.removeItem(courseNo))
    this.selectedShopItems = {}
  }

  course = computedFn((courseNo: string): Course | undefined => {
    const shopItem = this.shopItems[courseNo]
    if (!shopItem) return undefined
    return Object.keys(shopItem).reduce((accumulator, currentKey) => {
      if (currentKey != 'selectedSectionNo' && currentKey != 'isSelected')
        return {
          ...accumulator,
          [currentKey]: shopItem[currentKey as keyof Course],
        }
      else return { ...accumulator }
    }, {}) as Course
  })

  @computed
  get allCourses(): Course[] {
    const allCourses = Object.keys(this.shopItems).reduce((accumulator, currentCourseNo) => {
      const currentCourse = this.course(currentCourseNo)
      if (currentCourse) accumulator.push(currentCourse)
      return accumulator
    }, [] as Course[])
    // Sort by `courseNo`
    return sortCourses(allCourses, 'courseNo')
  }
}
