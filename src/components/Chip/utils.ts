import { Theme } from '@material-ui/core'
import { ChipShade } from './const'

/**
 *
 * @param shade shade to map to textColor and backgroundColor
 * @param theme theme material-ui
 */
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
