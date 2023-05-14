import * as cheerio from 'cheerio'

import {
  capacityParser,
  daysOfWeekParser,
  departmentParser,
  examDateParser,
  noteParser,
  periodParser,
  roomAndBuildingParser,
  studyProgramParser,
  teachersParser,
} from '@reg-scraper/scraper/parser'

import { ClassType, Course, GenEdType, Section, Semester } from '@cgr/schema'

export async function courseSelector(
  courseHtml: string,
  academicYear: string,
  semester: Semester
): Promise<Course> {
  // load html
  const $ = cheerio.load(courseHtml)

  //This list contain courseNo, abbrName, courseNameEn, credit, creditHour and courseCondition
  const list1: string[] = []
  //query and append value to list
  $(`font[face="Tahoma,Verdana,Arial,Helvetica"][color="#660000"]`).each((_, e) => {
    list1.push($(e).text().trim().replace(/\s+/g, ' '))
  })
  if (list1.length === 0) {
    throw new Error("Can't parse course")
  }

  //assign value to course
  const courseNo = list1[0]
  const abbrName = list1[1]
  const courseNameEn = list1[2]
  const credit = !parseFloat(list1[3]) ? 0 : parseFloat(list1[3])
  const creditHours = list1[4] + list1[5]
  const courseCondition = list1[6]

  //courseNo refer to faculty
  const faculty = courseNo.slice(0, 2)

  //This list contain studyProgram, courseNameTh, department and Both Exam Date
  const list2: string[] = []
  //query and append value to list
  $(`font[face="MS Sans Serif"][color="#660000"]`).each((_, e) => {
    list2.push($(e).text().trim())
  })

  //assign value to course
  const studyProgram = studyProgramParser(list2[0])
  const courseNameTh = list2[1]
  const department = departmentParser(list2[2])
  const midterm = examDateParser(list2[3])
  const final = examDateParser(list2[4])
  // ceate empty section array
  const sections: Section[] = []

  //initialize section
  let currentSection: Section = {
    sectionNo: '0',
    closed: true,
    capacity: {
      current: 0,
      max: 0,
    },
    classes: [],
    genEdType: 'NO',
  }
  const table = $('#Table3').get(0).children[1]
  $(table)
    .children()
    .each((idx, e) => {
      if (idx < 2) return
      //create row
      const row: string[] = []
      //push data to row
      $(e)
        .children()
        .each((_, e) => {
          row.push($(e).text().trim().replace(/\s+/g, ' '))
        })
      //check if selected row is Section (row[1] is string of number)
      const isSection = row[1].match(/^\d+/)
      const add = isSection ? 1 : 0
      //if it is new section , push last section and generate new section
      if (isSection) {
        const sectionNo = row[1]
        const closed = row[0] !== ''
        if (sectionNo !== currentSection.sectionNo) {
          if (currentSection.sectionNo !== '0') sections.push(currentSection)
          const note = noteParser(row[8])
          currentSection = {
            sectionNo,
            closed,
            capacity: capacityParser(row[9]),
            note,
            classes: [],
            genEdType: 'NO', // genEdType will be set later
          }
        }
      }
      // assign value to class
      const type = row[add + 1] as ClassType
      const days = daysOfWeekParser(row[add + 2])
      const period = periodParser(row[add + 3])
      const building = roomAndBuildingParser(row[add + 4])
      const room = roomAndBuildingParser(row[add + 5])
      const teachers = teachersParser(row[add + 6])
      if (days === undefined) {
        currentSection.classes.push({
          type,
          period,
          building,
          room,
          teachers,
        })
      } else {
        days.forEach((day) => {
          //push class into current section
          currentSection.classes.push({
            type,
            dayOfWeek: day,
            period,
            building,
            room,
            teachers,
          })
        })
      }
    })
  //push last section
  sections.push(currentSection)
  // create course
  const course: Course = {
    studyProgram,
    semester,
    academicYear,
    courseNo,
    abbrName,
    courseNameTh,
    courseNameEn,
    faculty,
    department,
    credit,
    creditHours,
    courseCondition,
    genEdType: 'NO',
    midterm,
    final,
    sections,
  }
  // return course
  return course
}
