import { Box } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import CourseLabel from '@/components/ShoppingCart/CourseLabel'

interface PropsType {
  course: {
    id: number
    name: string
    credit: number
    color: string
    category: string | null
  }
}

const CourseList = (props: PropsType) => {
  const { id, name, credit, color, category } = props.course
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" my={0.5}>
      <Box>
        <Box mr={0.5}>
          <Delete />
        </Box>
        <Box mx={0.5}>{id}</Box>
        <Box mx={0.5}>{name}</Box>
        <Box mx={0.5}>{credit} Credits</Box>
      </Box>

      <Box ml={0.5}>
        <CourseLabel color={color} category={category} />
      </Box>
    </Box>
  )
}

export default CourseList
