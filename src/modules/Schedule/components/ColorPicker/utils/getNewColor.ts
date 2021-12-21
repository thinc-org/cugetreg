import { Course } from '@thinc-org/chula-courses'

import { CourseCartItem } from '@/store'
import { difference } from '@/utils/difference'
import { randomInt } from '@/utils/randomInt'

import { OTHER_COLORS, ScheduleColor } from '../constants'

/**
 * This function returns a randomly picked color for the new selected course.
 * It is also used when user have undefined color.
 * `GENED_COLORS` are always reserved for GenEd courses otherwise `OTHER_COLORS` will be used.
 * The colors that are not intersected with `currentItems` will be picked first.
 * In other case it will return a random color from other than reserved colors.
 * @param currentItems Courses that are currently in the cart
 * @param newCourse The new course that will be added
 * @returns One of `SCHEDULE_COLORS` string
 */

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
  const newColor = difference(OTHER_COLORS as readonly ScheduleColor[], currentColors)[0]
  if (newColor) {
    return newColor
  }
  return OTHER_COLORS[randomInt(0, OTHER_COLORS.length)]
}
