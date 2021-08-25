import { Capacity, Course, Section } from '@thinc-org/chula-courses'
import { useState } from 'react'

import { dayOfWeekArray } from '@/common/constants/dayOfWeek'

import { CourseCardContextValue } from '../../context/types'
import sum from '../../utils/sum'
import unique from '../../utils/unique'

export default function useCourseCard(course: Course): CourseCardContextValue {
  const isGenEd = course.genEdType !== 'NO'

  const activeDays = course.sections.flatMap((section) => section.classes.map((sectionClass) => sectionClass.dayOfWeek))
  const classDays = dayOfWeekArray.flatMap((day) => (activeDays.includes(day) ? [day] : []))

  const courseCapacity: Capacity = {
    current: sum(course.sections.map((section) => section.capacity.current)),
    max: sum(course.sections.filter((section) => !section.closed).map((section) => section.capacity.max)),
  }

  const sectionNumbers = course.sections.map((section) => section.sectionNo)
  const [selectedSectionNumber, setSectionNumber] = useState(sectionNumbers[0])
  const selectedSection = course.sections.find((section) => section.sectionNo === selectedSectionNumber) as Section
  const teachers = unique(selectedSection.classes.flatMap((sectionClass) => sectionClass.teachers))

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