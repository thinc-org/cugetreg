import React, { createRef, useContext } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { CourseSearchContext, LIMIT_CONSTANT } from '@/context/CourseSearch'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { setSearchCourseVars, refetch, setOffset } = useContext(CourseSearchContext)
  const inputRef = createRef<HTMLInputElement>()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSearchCourseVars((currentVars) => {
      const value = inputRef.current?.value || ''
      currentVars.filter = { ...currentVars.filter, keyword: value, limit: LIMIT_CONSTANT, offset: 0 }
      refetch(currentVars)
      return currentVars
    })
    setOffset(0)
  }

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <InputBase
        fullWidth
        inputRef={inputRef}
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
