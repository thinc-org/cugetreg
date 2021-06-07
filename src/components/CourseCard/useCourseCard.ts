import { Capacity, Course, Section } from '@thinc-org/chula-courses'
import { dayOfWeek } from './const'
import { sum, unique } from './utils'
import { useState } from 'react'

export function useCourseCard(course: Course) {
  const isGenEd = course.genEdType !== 'NO'

  const activeDays = course.sections.flatMap((section) => section.classes.map((sectionClass) => sectionClass.dayOfWeek))
  const classDays = dayOfWeek.flatMap((day) => (activeDays.includes(day) ? [day] : []))

  const courseCapacity: Capacity = {
    current: sum(course.sections.map((section) => section.capacity.current)),
    max: sum(course.sections.map((section) => section.capacity.max)),
  }

  const sectionNumbers = course.sections.map((section) => section.sectionNo)
  const [selectedSectionNumber, setSectionNumber] = useState(sectionNumbers[0])
  const selectedSection = course.sections.find((section) => section.sectionNo === selectedSectionNumber) as Section
  const teachers = unique(selectedSection.classes.flatMap((sectionClass) => sectionClass.teachers))

  return {
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
