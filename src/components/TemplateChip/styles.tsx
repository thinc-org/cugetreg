import { Chip, makeStyles, styled, Theme } from '@material-ui/core'

interface ChipProps {
  backgroundColor: string
  textColor: string
  padding: string
}

export const EnhancedChip = styled(Chip)<Theme, ChipProps>({
  borderRadius: '100px',
  height: '100%',
  padding: ({ padding }) => padding,
  color: ({ textColor }) => textColor,
  backgroundColor: ({ backgroundColor }) => backgroundColor,
})

export const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.overline,
  },
}))
