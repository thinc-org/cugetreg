import SampleComponent from '@/components/SampleComponent'
import ShoppingPanel from '@/components/ShoppingPanel'
import { Button, Modal, Box } from '@material-ui/core'
import { useState } from 'react'

export default function Home() {
  const [showModal, setShowModal] = useState(false)

  function handleClose(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault()
    if (event.target === event.currentTarget) {
      setShowModal(false)
    }
  }

  return (
    <>
      <SampleComponent />

      <Button onClick={() => setShowModal(true)} variant="contained" color="primary">
        Show Modal
      </Button>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Box
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={handleClose}
        >
          <ShoppingPanel />
        </Box>
      </Modal>
    </>
  )
}
