import { Box, Button, Fade, Modal, TextField, Typography } from '@mui/material'

interface RejectModalProps {
  open: boolean
  onClose: () => void
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: 'none',
  boxShadow: 24,
  p: 4,
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
}

export default function RejectModal({ open, onClose }: RejectModalProps) {
  return (
    <Modal open={open}>
      <Fade in={open}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Please Enter Reject Reason</Typography>
            <Button onClick={onClose}>Close</Button>
          </Box>
          <TextField label="Reject Reason" focused required fullWidth />
          <Button sx={{ alignSelf: 'flex-end' }} onClick={onClose}>
            Submit
          </Button>
        </Box>
      </Fade>
    </Modal>
  )
}
