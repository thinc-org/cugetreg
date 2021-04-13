import { Container } from '@/components/Container'
import { CourseCard } from '@/components/CourseCard'
import { mockGenEdCourse, mockNoGenEdCourse } from '@/components/CourseCard/mockCourse'

export default function CourseSearchPage() {
  return (
    <Container>
      <CourseCard course={mockGenEdCourse} rating={1.23} />
      <CourseCard course={mockNoGenEdCourse} />
    </Container>
  )
}
