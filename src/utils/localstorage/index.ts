import { CourseCartItem, courseCartStore } from '@/store'
import { runInAction } from 'mobx'

const SHOPPING_CART_KEY = 'SHOPPING_CART_KEY'

export function syncWithLocalStorage(items: CourseCartItem[], isInitializedLocal: boolean, isNotLoggedIn: boolean) {
  const shoppingCart = localStorage.getItem(SHOPPING_CART_KEY)
  if (!shoppingCart) {
    const courses = JSON.stringify(items)
    localStorage.setItem(SHOPPING_CART_KEY, courses)
  } else if (!isInitializedLocal && isNotLoggedIn) {
    runInAction(() => {
      courseCartStore.isInitializedLocal = true
      courseCartStore.shopItems = JSON.parse(shoppingCart)
    })
  } else {
    const courses = JSON.stringify(items)
    localStorage.setItem(SHOPPING_CART_KEY, courses)
  }
}
