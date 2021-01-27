import { Box, Typography } from '@material-ui/core'

interface PropsType {
  textColor: string
  borderColor: string
  backgroundColor: string
  category: string
}

const Label = ({ textColor, borderColor, category, backgroundColor }: PropsType) => {
  return (
    <>
      <Box
        width={20}
        border={1}
        bgcolor={backgroundColor}
        borderColor={borderColor}
        borderRadius={100}
        px={1.5}
        py={0.5}
        color={textColor}
        textAlign="center"
      >
        <Typography variant="overline">{category}</Typography>
      </Box>
    </>
  )
}

export default Label
