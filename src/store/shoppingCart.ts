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

  private findFirstSectionNo(course: Course) {
    const sections = course.sections.sort((sectionA, sectionB) => (sectionA.sectionNo < sectionB.sectionNo ? -1 : 1))
    return sections[0].sectionNo
  }

  private convertToCourse(shopItem: ShoppingCartItem): Course {
    const { selectedSectionNo, isSelected, ...rest } = shopItem // eslint-disable-line
    return rest
  }

  @action
  addItem(course: Course, selectedSectionNo?: string): void {
    if (!selectedSectionNo) selectedSectionNo = this.findFirstSectionNo(course)
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == course.courseNo)
    const newItem: ShoppingCartItem = { ...course, selectedSectionNo, isSelected: false }
    if (foundIndex != -1) this.shopItems[foundIndex] = newItem
    else this.shopItems.push(newItem)
  }

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

  @action
  removeItems(): void {
    if (this.state === 'default') return
    this.shopItems = this.shopItems.filter((item) => item.isSelected === true)
    this.state = 'default'
  }

  @action
  swapOrder(courseNoA: string, courseNoB: string) {
    const indexA = this.shopItems.findIndex((item) => item.courseNo == courseNoA)
    const indexB = this.shopItems.findIndex((item) => item.courseNo == courseNoB)
    const temp = this.shopItems[indexA]
    this.shopItems[indexA] = this.shopItems[indexB]
    this.shopItems[indexB] = temp
  }

  course = computedFn((courseNo: string): Course | undefined => {
    const foundIndex = this.shopItems.findIndex((item) => item.courseNo == courseNo)
    if (foundIndex == -1) return
    return this.convertToCourse(this.shopItems[foundIndex])
  })

  @computed
  get courses(): Course[] {
    return this.shopItems.map((item) => this.convertToCourse(item))
  }
}
