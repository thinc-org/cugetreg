import { ForwardedRef, forwardRef } from 'react'

import { Dialog, DialogProps, Slide, SlideProps, useMediaQuery, useTheme } from '@mui/material'

import { deepAssign } from '@web/common/utils/deepAssign'

const Transition = forwardRef(function Transition(props: SlideProps, ref: ForwardedRef<unknown>) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface ResposiveDialogProps extends DialogProps {
  shouldExpand?: boolean
}

export const ResponsiveDialog = (props: ResposiveDialogProps) => {
  const { sx, shouldExpand = true, ...rest } = props
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
            ...(shouldExpand && {
              mx: [2, 4],
              width: (theme) => [
                `calc(100% - ${theme.spacing(4)})`,
                `calc(100% - ${theme.spacing(8)})`,
              ],
              maxWidth: (theme) => [
                `calc(100% - ${theme.spacing(4)})`,
                theme.breakpoints.values.sm,
              ],
            }),
            mt: 8,
          },
        },
        sx
      )}
      {...rest}
    />
  )
}
