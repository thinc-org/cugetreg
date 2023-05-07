import { parse } from 'date-fns'
import { th } from 'date-fns/locale'

import {
  Course,
  DayOfWeek,
  ExamPeriod,
  GenEdType,
  Period,
  Section,
  StudyProgram,
} from '@cgr/schema'

export function examDateParser(dateTh: string): ExamPeriod {
  if (dateTh[0] === 'T') {
    return undefined
  }
  //setting up date
  const dateSplit = dateTh.split(' ')
  const day = ('0' + dateSplit[0]).slice(-2)
  const month = dateSplit[1]
  const year = dateSplit[2]
  //parse Thai date to date type
  const dateString = `${day} ${month} ${year}`
  const date = parse(dateString, 'dd MMMM yyyy', new Date(), { locale: th }).toISOString()
  //parse period
  const period = periodParser(dateSplit[4])
  //return exam period
  return {
    date,
    period,
  }
}

export function studyProgramParser(studyProgram: string): StudyProgram {
  switch (studyProgram) {
    case 'ทวิภาค':
      return 'S'
    case 'ตรีภาค':
      return 'T'
    case 'ทวิภาค - นานาชาติ':
      return 'I'
    default:
      return 'S'
  }
}

export function departmentParser(faculty: string): string {
  return faculty.split('(')[1].split(')')[0].trim()
}

export function periodParser(periodString: string): Period {
  if (periodString == 'IA' || periodString == 'AR') {
    return {
      start: periodString,
      end: periodString,
    }
  }
  // split start and end
  let [start, end] = periodString.split('-')
  if (start.length < 5) {
    start = '0' + start
  }
  if (end.length < 5) {
    end = '0' + end
  }

  // return period
  return {
    start,
    end,
  }
}
export function capacityParser(capacity: string): Section['capacity'] {
  //split current and max
  const [current, max] = capacity.split('/')

  // return Capacity
  return {
    current: parseInt(current),
    max: parseInt(max),
  }
}

export function daysOfWeekParser(days: string): DayOfWeek[] {
  return days.split(' ') as DayOfWeek[] // TODO: find ways to make this more type-safe. Make it throw if invalid instead?
}

export function roomAndBuildingParser(name: string): string {
  if (name === 'IA') return undefined
  return name
}

export function teachersParser(names: string): string[] {
  return names.split(',')
}

export function noteParser(note: string): string | undefined {
  if (note === '') return undefined
  return note.replace(/\s+/g, ' ')
}
