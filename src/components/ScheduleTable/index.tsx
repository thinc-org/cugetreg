import { CourseCart } from '@/store'
import styled from '@emotion/styled'
import { ScheduleTableCard } from './components/ScheduleTableCard'

export interface ScheduleTableProps {
  courseCart: CourseCart
}

const Layout = styled.div`
  padding-bottom: 100px;
`

export function ScheduleTable({ courseCart }: ScheduleTableProps) {
  const items = courseCart.shopItems
  return (
    <Layout>
      {items.map((item) => (
        <ScheduleTableCard key={item.courseNo} item={item} />
      ))}
    </Layout>
  )
}
