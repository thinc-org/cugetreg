import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'

import { LoginGuardDialogProps } from '@/common/components/LoginGuardDialog/types'

export const LoginGuardDialog: React.FC<LoginGuardDialogProps> = ({ open, setOpen, onClose, onConfirm, onCancel }) => {
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
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description"
    >
      <DialogTitle id="login-dialog-title">
        <Typography variant="h6">คุณยังไม่ได้เข้าสู่ระบบ</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="login-dialog-description">
          คุณจะสามารถเขียนรีวิว กดไลก์ และรายงานรีวิวของผู้อื่นได้เมื่อเข้าสู่ระบบแล้วเท่านั้น
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>ยกเลิก</Button>
        <Button onClick={handleConfirm} autoFocus>
          เข้าสู่ระบบ
        </Button>
      </DialogActions>
    </Dialog>
  )
}
