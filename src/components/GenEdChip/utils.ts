import { GenEd } from '@/utils/types'
import { Theme } from '@material-ui/core'

export const genedColorMapper = (genEd: GenEd, theme: Theme) =>
  ({
    [GenEd.HU]: theme.palette.highlight.pink[700],
    [GenEd.IN]: theme.palette.highlight.purple[700],
    [GenEd.SC]: theme.palette.secondaryRange[900],
    [GenEd.SO]: theme.palette.highlight.green[700],
    [GenEd.NOT_GENED]: theme.palette.primary.main,
  }[genEd])
