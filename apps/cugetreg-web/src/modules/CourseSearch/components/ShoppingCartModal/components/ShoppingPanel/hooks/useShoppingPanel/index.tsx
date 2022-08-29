import { useState } from 'react'

import { Course } from '@thinc-org/chula-courses'

import { courseCartStore } from '@web/store'

export enum ShoppingState {
  Default = 'default',
  Delete = 'delete',
}

export function useShoppingPanel() {
  const [selectedCourses, setSeletedCourses] = useState<Course[]>([])
  const [shoppingState, setShoppingState] = useState<ShoppingState>(ShoppingState.Default)

  const onCheckboxChange = (checked: boolean, course: Course) => {
    if (checked) {
      setSeletedCourses((currentCourses) => [...currentCourses, course])
      setShoppingState(ShoppingState.Delete)
    } else {
      const newSelectedCourses = selectedCourses.filter((item) => item.courseNo != course.courseNo)
      if (newSelectedCourses.length == 0) {
        setShoppingState(ShoppingState.Default)
      }
      setSeletedCourses(newSelectedCourses)
    }
  }

  const removeAllSelectedCourses = () => {
    if (shoppingState === ShoppingState.Default) return

    selectedCourses.forEach((course) => {
      courseCartStore.removeCourse(course)
    })
    setShoppingState(ShoppingState.Default)
  }

  return { shoppingState, selectedCourses, onCheckboxChange, removeAllSelectedCourses }
}
