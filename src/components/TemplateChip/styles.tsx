import { Chip, makeStyles, styled, Theme } from '@material-ui/core'

interface ChipProps {
  backgroundcolor: string
  textcolor: string
  padding: string
}

export const EnhancedChip = styled(Chip)<Theme, ChipProps>({
  borderRadius: '100px',
  height: '100%',
  padding: ({ padding }) => padding,
  color: ({ textcolor }) => textcolor,
  backgroundColor: ({ backgroundcolor }) => backgroundcolor,
})

export const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.overline,
  },
}))
