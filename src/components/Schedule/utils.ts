import { useMemo } from 'react'
import { Course, Class, DayOfWeek, GenEdType } from '@thinc-org/chula-courses'
import { hourStart } from './constants'
import { Theme, useTheme } from '@material-ui/core'
import { HighlightColorRange } from '@/configs/theme/palette'

export type TimetableClass = Pick<Course, 'courseNo' | 'abbrName' | 'genEdType'> &
  Omit<Class, 'type'> & {
    hasOverlap?: boolean
  }

export type ScheduleClass = Omit<TimetableClass, 'period'> & {
  position: {
    start: number
    end: number
  }
}

export function getPosition(time: string) {
  const match = time.match(/(\d+):(\d+)/)
  if (!match) {
    throw new Error('Class time must be in format hh:mm')
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
      }
    }
  }
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
    }
    classes.forEach((scheduleClass) => {
      const { period, ...rest } = scheduleClass
      const start = getPosition(period.start)
      const end = getPosition(period.end)
      classesByDay[scheduleClass.dayOfWeek].push({
        ...rest,
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

interface ColorScheme {
  background: string
  border: string
  text: string
}

function getPaletteRange(theme: Theme, genEdType: GenEdType): HighlightColorRange {
  switch (genEdType) {
    case 'HU':
      return theme.palette.highlight.pink
    case 'IN':
      return theme.palette.highlight.purple
    case 'SO':
      return theme.palette.highlight.green
  }
  // gened sc
  const secondary = theme.palette.secondaryRange
  return {
    300: secondary[100],
    500: secondary[500],
    700: secondary[900],
  }
}

export function useColorScheme(genEdType: GenEdType | undefined, hasOverlap: boolean): ColorScheme {
  const theme = useTheme()
  if (hasOverlap) {
    return {
      background: theme.palette.highlight.red[700],
      border: theme.palette.highlight.red[500],
      text: theme.palette.common.white,
    }
  }
  if (typeof genEdType === 'undefined') {
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
