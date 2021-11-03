import { useTheme } from '@emotion/react'
import { Dialog, DialogProps, Slide, SlideProps, useMediaQuery } from '@material-ui/core'
import { ForwardedRef, forwardRef } from 'react'

import { deepAssign } from '@/common/utils/deepAssign'

const Transition = forwardRef((props: SlideProps, ref: ForwardedRef<unknown>) => {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ResponsiveDialog = ({ sx, ...props }: DialogProps) => {
  const theme = useTheme()
  const match = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Dialog
      scroll="body"
      TransitionComponent={match ? Transition : undefined}
      sx={deepAssign(
        {
          '& .MuiDialog-container': {
            pb: 'env(safe-area-inset-bottom)',
          },
          '&& .MuiDialog-paperScrollBody': {
            verticalAlign: ['bottom', 'middle'],
            m: [2, 4],
            width: (theme) => [`calc(100% - ${theme.spacing(4)})`, `calc(100% - ${theme.spacing(8)})`],
            maxWidth: (theme) => [`calc(100% - ${theme.spacing(4)})`, theme.breakpoints.values.sm],
          },
        },
        sx
      )}
      {...props}
    />
  )
}
