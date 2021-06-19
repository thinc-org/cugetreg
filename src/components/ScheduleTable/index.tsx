import { CourseCart } from '@/store'
import { ScheduleTableCard } from './components/ScheduleTableCard'

export interface ScheduleTableProps {
  courseCart: CourseCart
}

export function ScheduleTable({ courseCart }: ScheduleTableProps) {
  const items = courseCart.shopItems
  return (
    <div>
      {items.map((item) => (
        <ScheduleTableCard key={item.courseNo} item={item} />
      ))}
    </div>
  )
}
