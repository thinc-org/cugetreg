import { useState } from 'react'

import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import { Override } from '@cgr/codegen'

import { GenEdRowContainer } from './styled'

interface SingleGenEdProps {
  course: Override
}

export default function SingleGenEd({ course }: SingleGenEdProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    // TODO: call API for deleting and fetch new data
    handleClose()
    console.log('Delete: ', course.courseNo)
  }

  return (
    <GenEdRowContainer key={`${course.courseNo}${course.semester}${course.studyProgram}`}>
      <Typography sx={{ fontWeight: 700 }}>{course.genEd?.genEdType}</Typography>
      <Typography sx={{ fontWeight: 700 }}>{course.courseNo}</Typography>
      <Typography sx={{ fontWeight: 700, justifySelf: 'start' }}>{course.courseNo}</Typography>
      <Typography></Typography>
      <IconButton aria-label="delete" onClick={handleClick}>
        <MoreVertIcon />
        {/* <DeleteOutlinedIcon sx={{ fontSize: 24 }} onClick={() => handleDelete(course)} /> */}
      </IconButton>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {/* <GenEdCreditContainer>
                <Typography sx={{ fontWeight: 700, justifySelf: 'center' }}>
                  {course.courseNo}
                </Typography>
                <Typography sx={{ fontWeight: 700 }}></Typography>
              </GenEdCreditContainer> */}
    </GenEdRowContainer>
  )
}
