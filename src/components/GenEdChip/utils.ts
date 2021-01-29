import { GenEd } from '@/utils/types'
import { Theme } from '@material-ui/core'

export const genedColorMapper = (genEd: GenEd, theme: Theme) =>
  ({
    [GenEd.HU]: '#C7117F',
    [GenEd.IN]: '#681A83',
    [GenEd.SC]: theme.palette.secondaryRange[900],
    [GenEd.SO]: '#4B991C',
    [GenEd.NOT_GENED]: theme.palette.primary.main,
  }[genEd])
