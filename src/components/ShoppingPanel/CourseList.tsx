import { Box, Grid } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import CourseLabel from '@/components/ShoppingPanel/CourseLabel'

interface PropsType {
  course: {
    id: number
    name: string
    credit: number
    color: string
    category: string | null
  }
  deleteCourse: (id: number) => void
}

const CourseList = ({ course: { id, name, credit, color, category }, deleteCourse }: PropsType) => {
  return (
    <Box my={1}>
      <Grid container alignItems="center">
        <Grid item xs={1} sm={1}>
          <Box color="gray">
            <Delete onClick={() => deleteCourse(id)} style={{ cursor: 'pointer' }} />
          </Box>
        </Grid>
        <Grid item xs={5} sm={2}>
          <Box fontSize={16}>{id}</Box>
        </Grid>
        <Grid item xs={6} sm={5}>
          <Box fontSize={16}>{name}</Box>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Box fontSize={16}>{credit} Credits</Box>
        </Grid>
        <Grid item={true} container xs={6} sm={2}>
          <CourseLabel color={color} category={category} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CourseList
