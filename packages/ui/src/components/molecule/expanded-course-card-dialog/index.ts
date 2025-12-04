type CourseSection = {
  section: number
  seats: { status: 'full' | 'avaliable' | 'close'; count: string }
  instructors: string[]
  group: string
  schedule: { day: string; time: string; room: string; type: string }[]
  selectable?: boolean
}

export type Course = {
  code: string
  name: string
  credits: number
  reviews: number
  sections: CourseSection[]
}
export { default as ExpandedCourseCardDialog } from './expanded-course-card-dialog.svelte'
