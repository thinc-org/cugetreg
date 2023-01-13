import { Logger } from "@nestjs/common"
import { instance } from "../instance"
import { searchParam } from "../params/search.param"
import { searchSelector } from "../selector/search.selector"

const path = "/servlet/com.dtm.chula.cs.servlet.QueryCourseScheduleNew.CourseListNewServlet"

const faculties = [
  "01",
  "02",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "51",
  "53",
  "55",
  "56",
  "58",
]
const logger = new Logger("SearcbRequest")

export async function searchRequest(studyProgram: string, semester: string, acadyear: string) {
  // for colecting cookie
  await instance.get<string>(path)

  let courses: Array<string> = []
  //search for courses
  for (const faculty of faculties) {
    const response = await instance.get<string>(path, {
      params: searchParam(studyProgram, semester, acadyear, faculty),
    })
    logger.debug(
      `[Running] On ${studyProgram}-${semester}/${acadyear}: Fetching courseNos from faculty: ${faculty}`
    )
    const course = await searchSelector(response.data)
    courses = courses.concat(course)
  }
  return courses
}
