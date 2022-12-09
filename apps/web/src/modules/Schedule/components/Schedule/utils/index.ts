import { useMemo } from 'react'

import { useTheme } from '@mui/material'

import { getPaletteRange } from '@web/common/utils/getPaletteRange'
import { ExamClass } from '@web/common/utils/types'
import { CourseCartItem } from '@web/store'

import { Class, DayOfWeek, GenEdType, Section } from '@libs/codegen'

import { hourStart } from '../constants'
import { getOverlappingCourses } from './getOverlappingCourses'

export type TimetableClass = Pick<
  CourseCartItem,
  'courseNo' | 'studyProgram' | 'academicYear' | 'semester' | 'abbrName' | 'genEdType' | 'color'
> & {
  item: CourseCartItem
  section: Section
} & Omit<Class, 'type'> &
  Pick<Section, 'sectionNo'> & {
    classIndex: number
    hasOverlap?: boolean
  }

export type ScheduleClass = Omit<TimetableClass, 'period'> & {
  classIndex: number
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
      if (a.courseNo !== b.courseNo && a.position.start < b.position.end) {
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

export function useHourEnd(classes: ScheduleClass[]): number {
  let rightmostPosition = 0
  for (const cls of classes) {
    rightmostPosition = Math.max(rightmostPosition, cls.position.end)
  }
  const coursesHourEnd = Math.ceil(rightmostPosition + hourStart) - 2
  return Math.max(coursesHourEnd, 18)
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
  return useMemo(
    () => getOverlappingCourses(classes, midtermClasses, finalClasses),
    [classes, midtermClasses, finalClasses]
  )
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
      const {
        courseNo,
        abbrName,
        genEdType,
        selectedSectionNo,
        studyProgram,
        academicYear,
        semester,
      } = item
      const section = item.sections.find((section) => section.sectionNo === selectedSectionNo)
      if (!section) {
        return []
      }
      return section.classes.map((cls, index): TimetableClass => {
        const { dayOfWeek, period, building, room, teachers } = cls
        return {
          classIndex: index,
          courseNo,
          abbrName,
          genEdType,
          dayOfWeek,
          period,
          building,
          room,
          teachers,
          studyProgram,
          academicYear,
          semester,
          item,
          section,
          color: item.color,
          sectionNo: section.sectionNo,
        }
      })
    })
}
