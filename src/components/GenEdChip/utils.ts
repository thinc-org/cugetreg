import { Theme } from '@material-ui/core'
import { GenEdType } from '@thinc-org/chula-courses'

/**
 *
 * @param theme theme object for retrieving colours
 * @param genEd Gened type. Null if not genEd
 */
export const genedColorMapper = (theme: Theme, genEd?: GenEdType) => {
  if (!genEd) {
    return theme.palette.primary.main
  }
  return {
    HU: theme.palette.highlight.pink[700],
    IN: theme.palette.highlight.purple[700],
    SC: theme.palette.secondaryRange[900],
    SO: theme.palette.highlight.green[700],
  }[genEd]
}
