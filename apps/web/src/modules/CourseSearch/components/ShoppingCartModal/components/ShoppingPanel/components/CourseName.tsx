import React from 'react'

import { Link } from '@mui/material'

import { LinkWithAnalytics } from '@web/common/context/Analytics/components/LinkWithAnalytics'
import { SELECTED_COURSE_TITLE } from '@web/common/context/Analytics/constants'
import { useShoppingCardModal } from '@web/common/context/ShoppingCartModal'
import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'

import { Course } from '@libs/codegen'
import { genEdChipConfig } from '@libs/react-ui'

export interface CourseNameProps {
  course: Course
}

export const CourseName: React.FC<CourseNameProps> = ({ course }) => {
  const { abbrName, genEdType, courseNo } = course
  const color = genEdChipConfig[genEdType].color
  const { onClose } = useShoppingCardModal()

  const { buildLink } = useLinkBuilder()
  return (
    <LinkWithAnalytics
      href={buildLink(`/courses/${courseNo}`)}
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
