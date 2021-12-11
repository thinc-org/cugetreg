import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'

import { UniversalDialogProps } from './types'

export const UniversalDialog: React.FC<UniversalDialogProps> = ({
  open,
  setOpen,
  heading = '',
  content = '',
  primaryButtonText = '',
  secondaryButtonText = 'ยืนยัน',
  primaryButtonProps,
  secondaryButtonProps,
  onClose,
  onConfirm,
  onCancel,
  ...rest
}) => {
  const handleClose = () => {
    setOpen(false)
    onClose?.()
  }

  const handleCancel = () => {
    handleClose()
    onCancel?.()
  }

  const handleConfirm = () => {
    handleClose()
    onConfirm?.()
  }

  return (
    <Dialog open={open} onClose={handleClose} {...rest}>
      {heading && (
        <DialogTitle>
          <Typography variant="h6">{heading}</Typography>
        </DialogTitle>
      )}
      {content && (
        <DialogContent>
          <DialogContentText>{content}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        {secondaryButtonText && (
          <Button onClick={handleCancel} {...primaryButtonProps}>
            {secondaryButtonText}
          </Button>
        )}
        <Button onClick={handleConfirm} autoFocus {...secondaryButtonProps}>
          {primaryButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
