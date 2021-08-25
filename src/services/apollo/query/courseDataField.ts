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
    genEdType
    rating
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
            building
            teachers
        }
    }
`
