import { useState } from 'react'
import { toast } from 'react-hot-toast'

import { ApolloQueryResult } from '@apollo/client'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { Exact, GetOverridesQuery, Override, useDeleteOverrideMutation } from '@cgr/codegen'

import { GenEdRowContainer } from './styled'

interface SingleGenEdProps {
  course: Override
  refetchOverrides: (
    variables?:
      | Partial<
          Exact<{
            [key: string]: never
          }>
        >
      | undefined
  ) => Promise<ApolloQueryResult<GetOverridesQuery>>
}

export default function SingleGenEd({ course, refetchOverrides }: SingleGenEdProps) {
  const [deleteOverride] = useDeleteOverrideMutation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    handleClose()
    const toastId = toast.loading('Deleting Gened...')
    await deleteOverride({
      variables: {
        courseNo: course.courseNo,
      },
      onCompleted(data) {
        if (data.deleteOverride) toast.success('Delete GenEd Successfully', { id: toastId })
        else toast.error('Fail to delete GenEd', { id: toastId })
      },
    })
    await refetchOverrides()
  }

  return (
    <GenEdRowContainer key={`${course.courseNo}`}>
      <Typography sx={{ fontWeight: 700 }}>{course.genEdType}</Typography>
      <Typography sx={{ fontWeight: 700 }}>{course.courseNo}</Typography>
      <Typography sx={{ fontWeight: 700, justifySelf: 'start' }}>{course.courseNo}</Typography>
      <Typography></Typography>
      <IconButton aria-label="delete" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </GenEdRowContainer>
  )
}
