import { useTheme } from '@material-ui/core'
import { Course, Class, DayOfWeek, GenEdType } from '@thinc-org/chula-courses'
import { union, uniq } from 'lodash'
import { useMemo } from 'react'

import { getPaletteRange } from '@/common/utils/getPaletteRange'
import { ExamClass } from '@/common/utils/types'
import { CourseCartItem } from '@/store'

import { hourStart } from './constants'

export type TimetableClass = Pick<Course, 'courseNo' | 'abbrName' | 'genEdType'> &
  Omit<Class, 'type'> & {
    hasOverlap?: boolean
  }

export type ScheduleClass = Omit<TimetableClass, 'period'> & {
  overlaps: string[]
  position: {
    start: number
    end: number
  }
}

export function getPosition(time: string) {
  const match = time.match(/(\d+):(\d+)/)
  if (!match) {
    const match2 = time.match(/(\d+)/)
    if (!match2) {
      throw new Error('Class time must be in format hh:mm')
    }
    const hour = parseInt(match2[1]) - hourStart + 1
    return hour
  }
  const hour = parseInt(match[1]) - hourStart + 1
  const minute = parseInt(match[2])
  return hour + minute / 60
}

function checkOverlap(classes: ScheduleClass[]) {
  classes.sort((a, b) => b.position.end - a.position.end)
  for (let i = 0; i < classes.length; i++) {
    for (let j = i + 1; j < classes.length; j++) {
      const a = classes[i]
      const b = classes[j]
      if (a.position.start < b.position.end) {
        a.hasOverlap = true
        b.hasOverlap = true
        a.overlaps.push(b.abbrName)
        b.overlaps.push(a.abbrName)
      }
    }
  }
}

function isValidTime(time: string | undefined): boolean {
  if (typeof time === 'undefined') {
    return false
  }
  return time !== 'IA' && time !== 'AR'
}

export function useScheduleClass(classes: TimetableClass[]) {
  return useMemo(() => {
    const classesByDay: Record<DayOfWeek, ScheduleClass[]> = {
      MO: [],
      TU: [],
      WE: [],
      TH: [],
      FR: [],
      SA: [],
      SU: [],
      IA: [],
      AR: [],
    }
    classes.forEach((scheduleClass) => {
      const { period, ...rest } = scheduleClass
      if (!isValidTime(period?.start) || !isValidTime(period?.end)) {
        return
      }
      const start = getPosition(period?.start || '')
      const end = getPosition(period?.end || '')
      classesByDay[scheduleClass.dayOfWeek || 'AR'].push({
        ...rest,
        overlaps: [],
        position: { start, end },
      })
    })

    checkOverlap(classesByDay.MO)
    checkOverlap(classesByDay.TU)
    checkOverlap(classesByDay.WE)
    checkOverlap(classesByDay.TH)
    checkOverlap(classesByDay.FR)
    checkOverlap(classesByDay.SA)
    checkOverlap(classesByDay.SU)

    return [
      ...classesByDay.MO,
      ...classesByDay.TU,
      ...classesByDay.WE,
      ...classesByDay.TH,
      ...classesByDay.FR,
      ...classesByDay.SA,
      ...classesByDay.SU,
    ]
  }, [classes])
}

export function useDaysCount(classes: ScheduleClass[]): number {
  let daysCount = 5
  for (const cls of classes) {
    switch (cls.dayOfWeek) {
      case 'SA':
        daysCount = Math.max(daysCount, 6)
        break
      case 'SU':
        daysCount = 7
        break
      default:
        break
    }
  }
  return daysCount
}

export type CourseOverlap = {
  hasOverlap: boolean
  classes: string[]
  exams: string[]
}

export interface CourseOverlapMap {
  [courseNo: string]: CourseOverlap
}

export function useOverlappingCourses(
  classes: ScheduleClass[],
  midtermClasses: ExamClass[],
  finalClasses: ExamClass[]
) {
  return useMemo(() => {
    const courses: CourseOverlapMap = {}
    classes.forEach((it) => {
      courses[it.courseNo] = {
        hasOverlap: false,
        classes: uniq(it.overlaps),
        exams: [],
      }
    })
    midtermClasses.forEach((it) => {
      if (it.hasOverlap === true) {
        courses[it.courseNo].exams = it.overlaps
      }
    })
    finalClasses.forEach((it) => {
      if (it.hasOverlap === true) {
        courses[it.courseNo].exams = uniq([...courses[it.courseNo].exams, ...it.overlaps])
      }
    })
    Object.entries(courses).forEach(([courseNo, course]) => {
      courses[courseNo].hasOverlap = course.classes.length > 0 || course.exams.length > 0
    })
    return courses
  }, [classes, midtermClasses, finalClasses])
}

interface ColorScheme {
  background: string
  border: string
  text: string
}

export function useColorScheme(genEdType: GenEdType, hasOverlap: boolean): ColorScheme {
  const theme = useTheme()
  if (hasOverlap) {
    return {
      background: theme.palette.highlight.red[700],
      border: theme.palette.highlight.red[500],
      text: theme.palette.common.white,
    }
  }
  if (genEdType === 'NO') {
    return {
      background: theme.palette.primaryRange[10],
      border: theme.palette.primaryRange[50],
      text: theme.palette.primaryRange[500],
    }
  }
  const range = getPaletteRange(theme, genEdType)
  return {
    background: range[300],
    border: range[700],
    text: range[700],
  }
}

export function useTimetableClasses(shopItems: CourseCartItem[]) {
  return shopItems
    .filter((item) => !item.isHidden)
    .flatMap((item) => {
      const { courseNo, abbrName, genEdType, selectedSectionNo } = item
      const section = item.sections.find((section) => section.sectionNo === selectedSectionNo)
      if (!section) {
        return []
      }
      return section.classes.map(
        (cls): TimetableClass => {
          const { dayOfWeek, period, building, room, teachers } = cls
          return {
            courseNo,
            abbrName,
            genEdType,
            dayOfWeek,
            period,
            building,
            room,
            teachers,
          }
        }
      )
    })
}
