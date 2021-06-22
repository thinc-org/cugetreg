import { dayOfWeekMapper } from '@/constants/dayOfWeek'
import { Capacity, Course, DayOfWeek, Section } from '@thinc-org/chula-courses'
import { sum, unique } from '@/components/CourseCard/utils'
import { useState } from 'react'

export function useCourseCard(course: Course) {
  const isGenEd = course.genEdType !== 'NO'

  const activeDays = course.sections.flatMap((section) => section.classes.map((sectionClass) => sectionClass.dayOfWeek))

  const classDays = (Object.keys(dayOfWeekMapper) as DayOfWeek[]).reduce((prev: DayOfWeek[], day: DayOfWeek) => {
    prev.concat(activeDays.includes(day) ? [day] : [])
    return prev
  }, [])

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
