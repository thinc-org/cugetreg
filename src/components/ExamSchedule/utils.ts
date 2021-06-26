import { CourseCartItem } from '@/store'
import { useMemo } from 'react'
import { ExamClass } from './components/ExamCard'

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

  return hasExamClassesSorted.concat(notHasExamClasses)
}

export function findOverlap(sortedClasses: CourseCartItem[], isMidterm: boolean) {
  const overlapNumber: number[] = []
  for (let i = 0; i < sortedClasses.length; i++) {
    const exam = getExamPeriod(sortedClasses[i], isMidterm)
    if (exam) {
      for (let j = i + 1; j < sortedClasses.length; j++) {
        const examNext = getExamPeriod(sortedClasses[j], isMidterm)
        if (examNext && exam.date === examNext.date) {
          const { hour, minute } = getHourMinuteFromPeriod(exam.period.end)
          const { hour: hourNext, minute: minuteNext } = getHourMinuteFromPeriod(examNext.period.start)
          if (hour > hourNext || (hour === hourNext && minute > minuteNext)) {
            overlapNumber.push(i)
            overlapNumber.push(j)
          } else {
            break
          }
        }
      }
    }
  }

  return sortedClasses.map((class_, index) => {
    const { courseNo, abbrName, genEdType, midterm, final } = class_
    const hasOverlap = overlapNumber.includes(index)
    return { courseNo, abbrName, genEdType, midterm, final, hasOverlap } as ExamClass
  })
}

export function useExamClasses(courses: CourseCartItem[]) {
  const courseFiltered = courses.filter((course) => course.isHidden)
  const midtermClasses = useMemo(() => {
    const midtermClassesSorted = sortExamSchedule(courseFiltered, true)
    return findOverlap(midtermClassesSorted, true)
  }, [courseFiltered])

  const finalClasses = useMemo(() => {
    const finalClassesSorted = sortExamSchedule(courseFiltered, false)
    return findOverlap(finalClassesSorted, false)
  }, [courseFiltered])

  return { midtermClasses, finalClasses }
}
