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

  private removeItem(courseNo: string) {
    if (this.shopItems[courseNo]) delete this.shopItems[courseNo]
    if (this.selectedShopItems[courseNo]) delete this.selectedShopItems[courseNo]
  }

  /**
   * this method used for toggling selection state of the shopItems
   * @param {string} courseNo - the course number
   */
  @action
  toggleItemSelection(courseNo: string) {
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

  /**
   * This method used for adding interested courses into the shopping cart
   * @param {string} course - the course number
   * @param {string} [selectedSectionNo=1] - the selected section of the course, default value is 1
   */
  @action
  addItem(course: Course, selectedSectionNo = '1') {
    // TODO create a function that find the first course's section number
    const shopItem = this.createNewItem(course, selectedSectionNo)
    this.shopItems[shopItem.courseNo] = shopItem
  }

  /**
   * This method used for removing the selected courses
   */
  @action
  removeSelectedItems() {
    Object.keys(this.selectedShopItems).forEach((courseNo) => this.removeItem(courseNo))
    this.selectedShopItems = {}
  }

  /**
   * This method used for getting one course from the shopping cart
   * @param {string} course - the course number
   */
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

  /**
   * This method used for getting all courses from the shopping cart
   * The courses is sorted by `courseNo`
   */
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
