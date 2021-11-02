import { Stack, Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

import { NoSeatIcon } from '@/common/components/NoSeatIcon'

import { SectionStatusProps } from './types'

const style = {
  avialable: {
    backgroundColor: 'highlight.green.300',
    color: 'highlight.green.700',
  },
  full: {
    backgroundColor: 'highlight.red.300',
    color: 'highlight.red.700',
  },
  closed: {
    backgroundColor: 'highlight.red.500',
    color: 'white',
  },
}

export const SectionStatus = ({ closed, capacity, ...rest }: SectionStatusProps) => {
  const { t } = useTranslation('sectionCard')

  const status = closed ? 'closed' : capacity.current >= capacity.max ? 'full' : 'avialable'
  const seatColor = status === 'closed' ? 'white' : 'primary.main'

  return (
    <Typography
      variant="h6"
      ml={1}
      px={2}
      py={0.5}
      sx={{
        borderRadius: 1,
        whiteSpace: 'nowrap',
        height: 'fit-content',
        ...style[status],
        ...rest.sx,
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <div>{t(status, capacity)}</div>
        <NoSeatIcon sx={{ color: seatColor }} />
      </Stack>
    </Typography>
  )
}
