import { Course } from '@thinc-org/chula-courses'
import * as fs from 'fs'

const studyPrograms = ['S', 'T', 'I']
const acadyears = ['2563']

const dirName = './courses/'

async function main() {
  fs.mkdir('./analytics', () => {
    console.log('analytics directory already exists')
  })
  for (const studyProgram of studyPrograms) {
    for (const acadyear of acadyears) {
      for (let i = 1; i <= 3; i++) {
        const semester = i.toString()

        // read file
        const fileName = `${studyProgram}-${semester}-${acadyear}.json`
        const rawData = fs.readFileSync(dirName + fileName, 'utf-8')
        const courses = (await JSON.parse(rawData)) as Course[]

        // initiate results
        const courseCount = courses.length
        const timeSet = new Set()
        let sectionCount = 0
        let classCount = 0
        let weekendClass = 0
        let earliestTime = '24:00'
        let earliestCourse: string[] = []
        let latestTime = '00:00'
        let latestCourse: string[] = []

        for (const course of courses) {
          //get sections from courses
          const sections = course.sections
          // add number of section
          sectionCount += sections.length
          for (const section of sections) {
            //get classes from section
            const classes = section.classes
            //add number of classes
            classCount += classes.length
            for (const courseClass of classes) {
              //get period
              const period = courseClass.period
              // check if period exist
              if (period) {
                // get start and end time
                const start = ('0' + period.start).slice(-5)
                const end = ('0' + period.end).slice(-5)

                if (start && end && start <= '24:59' && end <= '24:59') {
                  // add period
                  timeSet.add(start.slice(-2))
                  timeSet.add(end.slice(-2))

                  // set earliest time
                  if (start < earliestTime) {
                    earliestTime = start
                    earliestCourse = [course.courseNo]
                  } else if (start === earliestTime) {
                    earliestCourse.push(course.courseNo)
                  }
                  if (end > latestTime) {
                    // set latest time
                    latestTime = end
                    latestCourse = [course.courseNo]
                  } else if (end === latestTime) {
                    latestCourse.push(course.courseNo)
                  }
                }
              }

              //get day of week
              const dayOfWeek = courseClass.dayOfWeek
              if (dayOfWeek === 'SA' || dayOfWeek === 'SU') {
                weekendClass += 1
              }
            }
          }
        }
        const timeSlot = Array.from(timeSet)
        // extract result
        const result = {
          courseCount,
          sectionCount,
          classCount,
          weekendClass,
          earliestTime,
          earliestCourse,
          latestTime,
          latestCourse,
          timeSlot,
        }
        //save result
        fs.writeFileSync('./analytics/' + fileName, JSON.stringify(result))
      }
    }
  }
}

main()
