import { Box, makeStyles, Typography } from '@material-ui/core'

interface PropsType {
  textColor: string
  backgroundColor: string
  category: string
  className?: string
}

const useStyles = makeStyles({
  font: {
    fontWeight: 'bold',
  },
})

const Chip = ({ textColor, category, backgroundColor, className }: PropsType) => {
  const styles = useStyles()

  return (
    <Box
      className={className}
      display="inline-flex"
      bgcolor={backgroundColor}
      borderRadius={100}
      px={2.5}
      py={0.25}
      color={textColor}
      textAlign="center"
    >
      <Typography key="overline" variant="overline" className={styles.font}>
        {category}
      </Typography>
    </Box>
  )
}

export default Chip
