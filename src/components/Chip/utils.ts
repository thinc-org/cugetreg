import { Theme } from '@material-ui/core'
import { ChipShade } from './const'

export const shadeMapper = (shade: ChipShade, theme: Theme) => {
  const textColor = theme.palette.primaryRange[500]
  const backgroundMap = {
    [ChipShade.primaryRange]: theme.palette.primaryRange[30],
    [ChipShade.secondaryRange]: theme.palette.secondaryRange[500],
  }
  return {
    textColor,
    backgroundColor: backgroundMap[shade],
  }
}
