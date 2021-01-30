import { Typography, makeStyles, Theme } from '@material-ui/core'

interface PropsType {
  color: string
  category: string | null
}

const useStyles = makeStyles<Theme, PropsType>({
  container: (props) => ({
    borderRadius: 100,
    padding: '2.5px 13px',
    border: '1px solid',
    color: props.color,
    borderColor: props.color,
    textAlign: 'center',
    display: props.category === null ? 'none' : 'block',
  }),
})
const CourseLabel = (props: PropsType) => {
  const { category } = props
  const classes = useStyles(props)
  return (
    <div className={classes.container}>
      <Typography variant="overline">{category !== null ? category : ''}</Typography>
    </div>
  )
}

export default CourseLabel
