export const COURSE_DATA_FIELDS = `
    studyProgram
    semester
    academicYear
    courseNo
    abbrName
    courseNameTh
    courseNameEn
    faculty
    department
    credit
    creditHours
    courseCondition
    courseDescTh
    courseDescEn
    genEdType
    midterm {
      date
      period {
        start
        end
      }
    }
    final {
      date
      period {
        start
        end
      }
    }
    sections {
        genEdType
        sectionNo
        closed
        capacity {
            current
            max
        }
        note
        classes {
            type
            dayOfWeek
            period {
                start
                end
            }
            room
            building
            teachers
        }
    }
`
