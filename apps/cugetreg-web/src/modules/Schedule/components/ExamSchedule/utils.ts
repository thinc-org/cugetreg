import { useMemo } from 'react'

import { ExamClass } from '@web/common/utils/types'
import { CourseCartItem } from '@web/store'

function getExamPeriod(class_: CourseCartItem, isMidterm: boolean) {
  return isMidterm ? class_.midterm : class_.final
}

function getHourMinuteFromPeriod(period: string) {
  const periodArray = period.split(':')
  return {
    hour: Number(periodArray[0]),
    minute: Number(periodArray[1]),
  }
}

export function sortExamSchedule(classes: CourseCartItem[], isMidterm: boolean) {
  const hasExamClasses: CourseCartItem[] = []
  const notHasExamClasses: CourseCartItem[] = []

  classes.forEach((class_) => {
    const examPeriod = getExamPeriod(class_, isMidterm)
    if (examPeriod) {
      hasExamClasses.push(class_)
    } else {
      notHasExamClasses.push(class_)
    }
  })

  const hasExamClassesSorted = hasExamClasses.sort((a, b) => {
    const bExam = isMidterm ? b.midterm : b.final
    const aExam = isMidterm ? a.midterm : a.final

    const { hour: aHour, minute: aMinute } = getHourMinuteFromPeriod(aExam?.period.start || '')
    const { hour: bHour, minute: bMinute } = getHourMinuteFromPeriod(bExam?.period.start || '')

    const dateCompare = aExam?.date.localeCompare(bExam?.date || '')
    const hourCompare = aHour - bHour
    const minuteCompare = aMinute - bMinute
    return dateCompare || hourCompare || minuteCompare
  })

  const sortedClasses = hasExamClassesSorted.concat(notHasExamClasses)

  const hiddenClasses: CourseCartItem[] = []
  const notHiddenClasses: CourseCartItem[] = []
  sortedClasses.forEach((class_) => {
    if (class_.isHidden) {
      hiddenClasses.push(class_)
    } else {
      notHiddenClasses.push(class_)
    }
  })

  return notHiddenClasses.concat(hiddenClasses)
}

export function findOverlap(sortedClasses: CourseCartItem[], isMidterm: boolean) {
  const mapOverlap: Record<number, number[]> = {}
  const classes = sortedClasses.filter((class_) => !class_.isHidden)
  for (let i = 0; i < classes.length; i++) {
    const exam = getExamPeriod(classes[i], isMidterm)
    if (exam) {
      for (let j = i + 1; j < classes.length; j++) {
        const examNext = getExamPeriod(classes[j], isMidterm)
        if (examNext && exam.date === examNext.date) {
          const { hour, minute } = getHourMinuteFromPeriod(exam.period.end)
          const { hour: hourNext, minute: minuteNext } = getHourMinuteFromPeriod(
            examNext.period.start
          )
          if (hour > hourNext || (hour === hourNext && minute > minuteNext)) {
            mapOverlap[i] = [...(mapOverlap[i] ?? []), j]
            mapOverlap[j] = [...(mapOverlap[j] ?? []), i]
          }
        }
      }
    }
  }

  return sortedClasses.map((class_, index) => {
    const { courseNo, abbrName, genEdType, midterm, final, isHidden, color } = class_
    const hasOverlap = !!mapOverlap[index]
    const overlaps = mapOverlap[index]?.map((i) => sortedClasses[i].abbrName) || []
    return {
      courseNo,
      abbrName,
      genEdType,
      midterm,
      final,
      hasOverlap,
      isHidden,
      overlaps,
      color,
    } as ExamClass
  })
}

export function useExamClasses(courses: CourseCartItem[]) {
  const courseDisplayLength = courses.filter((course) => !course.isHidden).length
  const midtermClasses = useMemo(() => {
    const midtermClassesSorted = sortExamSchedule(courses, true)
    return findOverlap(midtermClassesSorted, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDisplayLength, courses])

  const finalClasses = useMemo(() => {
    const finalClassesSorted = sortExamSchedule(courses, false)
    return findOverlap(finalClassesSorted, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDisplayLength, courses])

  return { midtermClasses, finalClasses }
}
