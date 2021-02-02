import SampleComponent from '@/components/SampleComponent'
import ShoppingPanel from '@/components/ShoppingPanel'
import { mockData } from '@/components/ShoppingPanel/mockData'
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
    </>
  )
}
