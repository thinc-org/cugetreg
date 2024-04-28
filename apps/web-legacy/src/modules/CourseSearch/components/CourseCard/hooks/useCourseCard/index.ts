import { useState } from 'react'

import { dayOfWeekArray } from '@web/common/constants/dayOfWeek'
import { useDisclosure } from '@web/common/hooks/useDisclosure'
import { CourseCardContextValue } from '@web/modules/CourseSearch/components/CourseCard/context/types'
import { sum } from '@web/utils/sum'
import { uniq } from '@web/utils/uniq'

import { Capacity, Course, Section } from '@cgr/codegen'

export function useCourseCardContext(course: Course): CourseCardContextValue {
  const courseCardValue = useCourseCardValue(course)
  const { isOpen, onToggle } = useDisclosure()
  return {
    ...courseCardValue,
    isExpanded: isOpen,
    onToggle,
  }
}

function useCourseCardValue(course: Course) {
  const isGenEd = course.genEdType !== 'NO'

  const activeDays = course.sections.flatMap((section) =>
    section.classes.map((sectionClass) => sectionClass.dayOfWeek)
  )
  const classDays = dayOfWeekArray.flatMap((day) => (activeDays.includes(day) ? [day] : []))

  const courseCapacity: Capacity = {
    current: sum(course.sections.map((section) => section.capacity.current)),
    max: sum(
      course.sections.filter((section) => !section.closed).map((section) => section.capacity.max)
    ),
  }

  const sectionNumbers = course.sections.map((section) => section.sectionNo)
  const [selectedSectionNumber, setSectionNumber] = useState(sectionNumbers[0])
  const selectedSection = course.sections.find(
    (section) => section.sectionNo === selectedSectionNumber
  ) as Section
  const teachers = uniq(selectedSection.classes.flatMap((sectionClass) => sectionClass.teachers))
  return {
    course,
    isGenEd,
    classDays,
    courseCapacity,
    sectionNumbers,
    selectedSectionNumber,
    setSectionNumber,
    selectedSection,
    teachers,
  }
}
