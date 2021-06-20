import React, { useContext } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { CourseSearchContext } from '@/context/CourseSearch'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { searchInputRef, onSubmit } = useContext(CourseSearchContext)

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <InputBase
        fullWidth
        inputRef={searchInputRef}
        placeholder="ค้นหารหัสวิชา / ชื่อวิชา"
        margin="dense"
        className={classes.input}
      />
      <IconButton type="submit" aria-label="search" className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
