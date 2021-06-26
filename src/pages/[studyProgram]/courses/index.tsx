import { useState } from 'react'
import {
  Box,
  Dialog,
  DialogTitle,
  Hidden,
  IconButton,
  makeStyles,
  Stack as MuiStack,
  Typography,
} from '@material-ui/core'
import { CourseList } from '@/components/CourseList'
import { SearchField } from '@/components/SearchField'
import { FilterIconButton } from '@/components/FilterIconButton'
import { SelectedCoursesButton } from '@/components/SelectedCoursesButton'
import { FilterSection } from '@/components/FilterSection'
import styled from '@emotion/styled'
import { TagList } from '@/components/TagList'
import { useDisclosure } from '@/hooks/useDisclosure'
import React from 'react'
import { ImCross } from 'react-icons/im'
import ShoppingPanel from '@/components/ShoppingPanel'
import { useStyles } from '@/components/CR11/styles'

const Stack = styled(MuiStack)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`

const StickyStack = styled(Stack)`
  position: sticky;
  top: 0;
  padding-top: ${({ theme }) => theme.spacing(4)};
  z-index: ${({ theme }) => theme.zIndex.appBar + 1};
  background: white;
  button {
    background: ${({ theme }) => theme.palette.background.default};
  }
`

const modalStyle = makeStyles(() => ({
  closeBtn: {
    position: 'absolute',
    right: '1em',
    top: '0em',
  },
}))

function CourseSearchPage() {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { isOpen, onClose, onOpen } = useDisclosure()

  const modalSty = modalStyle()

  return (
    <Box padding="2em">
      <Stack spacing={2} direction="row">
        <Typography variant="h2">ค้นหาวิชาเรียน</Typography>
      </Stack>
      <StickyStack spacing={2} direction="row">
        <SearchField />
        <FilterIconButton onClick={() => setOpenFilterBar((open) => !open)} />
        <Hidden mdDown>
          <SelectedCoursesButton onClick={onOpen} />
        </Hidden>
      </StickyStack>
      <Stack spacing={3} direction="row">
        <TagList />
      </Stack>
      <Stack spacing={3} direction="row">
        <CourseList />
        <FilterSection open={openFilterBar} setOpen={setOpenFilterBar} />
      </Stack>
      <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          รายวิชาที่ถูกเลือก{' '}
          <IconButton onClick={onClose} className={modalSty.closeBtn}>
            <ImCross />
          </IconButton>
        </DialogTitle>
        <ShoppingPanel />
      </Dialog>
    </Box>
  )
}

export default CourseSearchPage
