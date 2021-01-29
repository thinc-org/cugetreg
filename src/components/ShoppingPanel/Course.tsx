import { Box, Grid, makeStyles, Typography } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import CourseLabel from '@/components/ShoppingPanel/CourseLabel'
import { lightTheme } from '@/configs/theme'

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
const useStyles = makeStyles({
  wrapper: {
    margin: '6px 0px',
  },
  rootGrid: {
    alignItems: 'center',
  },
  deleteButton: {
    cursor: 'pointer',
    color: lightTheme.palette.primaryRange[100],
  },
  deleteButtonWrapper: {
    display: 'flex',
    justifyContent: 'start',
    alighItems: 'center',
  },
})

const Course = ({ course: { id, name, credit, color, category }, deleteCourse }: PropsType) => {
  const classes = useStyles()

  return (
    <Box className={classes.wrapper}>
      <Grid className={classes.rootGrid} container>
        <Grid item xs={1} sm={1}>
          <Box className={classes.deleteButtonWrapper}>
            <Delete onClick={() => deleteCourse(id)} className={classes.deleteButton} />
          </Box>
        </Grid>
        <Grid item xs={5} sm={2}>
          <Typography variant="body1">{id}</Typography>
        </Grid>
        <Grid item xs={6} sm={5}>
          <Typography variant="body1">{name}</Typography>
        </Grid>
        <Grid item xs={6} sm={2}>
          <Typography variant="body1">{credit} Credits</Typography>
        </Grid>
        <Grid item={true} container xs={6} sm={2}>
          <CourseLabel color={color} category={category} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Course
