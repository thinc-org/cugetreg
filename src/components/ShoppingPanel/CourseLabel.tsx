import { Box } from '@material-ui/core'

interface PropsType {
  color: string
  category: string | null
}
const CourseLabel = (props: PropsType) => {
  const { color, category } = props
  return (
    <>
      <Box
        color={color}
        border={1.5}
        borderColor={color}
        textAlign="center"
        borderRadius={12}
        px={1.5}
        py={0.5}
        fontWeight="fontWeightMedium"
        fontSize={12}
        hidden={category === null}
      >
        {category !== null ? category : ''}
      </Box>
    </>
  )
}

export default CourseLabel

//TODO: - Determine global border radius
