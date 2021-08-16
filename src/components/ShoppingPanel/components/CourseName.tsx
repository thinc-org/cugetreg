import { Link } from '@material-ui/core'
import { Course } from '@thinc-org/chula-courses'
import React from 'react'

import { genEdChipConfig } from '@/components/Chips/config'
import { useShoppingCardModal } from '@/context/ShoppingCartModal'
import { LinkWithAnalytics } from '@/context/analytics/components/LinkWithAnalytics'
import { SELECTED_COURSE_TITLE } from '@/context/analytics/components/const'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

export interface CourseNameProps {
  course: Course
}

export const CourseName: React.FC<CourseNameProps> = ({ course }) => {
  const { abbrName, genEdType, courseNo } = course
  const color = genEdChipConfig[genEdType].color
  const { onClose } = useShoppingCardModal()

  const { studyProgram } = useCourseGroup()
  return (
    <LinkWithAnalytics
      href={`/${studyProgram}/courses/${courseNo}`}
      passHref
      elementName={SELECTED_COURSE_TITLE}
      elementId={courseNo}
    >
      <Link color={{ xs: `${color}.main`, sm: 'primary.main' }} onClick={onClose}>
        {abbrName}
      </Link>
    </LinkWithAnalytics>
  )
}
