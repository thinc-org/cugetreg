import { useTheme } from '@emotion/react'
import { Dialog, DialogProps, Slide, SlideProps, useMediaQuery } from '@material-ui/core'
import { ForwardedRef, forwardRef } from 'react'

import { deepAssign } from '@/utils/deepAssign'

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
          '&& .MuiDialog-paperScrollBody': {
            verticalAlign: ['bottom', 'middle'],
          },
        },
        sx
      )}
      {...props}
    />
  )
}
