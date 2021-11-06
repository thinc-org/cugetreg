import { Course } from '@thinc-org/chula-courses'
import { difference, random } from 'lodash'

import { CourseCartItem } from '@/store'

import { OTHER_COLORS } from '../constants'

export function getNewColor(currentItems: CourseCartItem[], newCourse: Course) {
  switch (newCourse.genEdType) {
    case 'HU':
      return 'pink'
    case 'IN':
      return 'purple'
    case 'SO':
      return 'green'
    case 'SC':
      return 'secondary'
  }
  const currentColors = currentItems.map((item) => item.color)
  const newColor = difference(OTHER_COLORS, currentColors)[0]
  if (newColor) {
    return newColor
  }
  return OTHER_COLORS[random(0, OTHER_COLORS.length)]
}
