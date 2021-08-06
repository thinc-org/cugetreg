import styled from '@emotion/styled'
import { Dialog, IconButton, DialogTitle } from '@material-ui/core'
import { useContext } from 'react'
import { MdClose } from 'react-icons/md'

import ShoppingPanel from '@/components/ShoppingPanel'
import { ShoppingCartModalContext } from '@/context/ShoppingCartModal'

const Title = styled.div`
  display: flex;
  align-items: center;
  padding-right: 4px;
`

const FlexOne = styled.div`
  flex: 1;
`

export function ShoppingCartModal() {
  const { isOpen, onClose } = useContext(ShoppingCartModalContext)
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <Title>
        <DialogTitle>รายวิชาที่ถูกเลือก</DialogTitle>
        <FlexOne />
        <IconButton onClick={onClose}>
          <MdClose />
        </IconButton>
      </Title>
      <ShoppingPanel />
    </Dialog>
  )
}
