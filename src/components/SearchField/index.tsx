import React, { createRef, useContext } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { CourseSearchContext } from '@/context/CourseSearch'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { setFilter } = useSearchCourseQueryParams()
  const inputRef = createRef<HTMLInputElement>()
  const { setOffset } = useContext(CourseSearchContext)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = inputRef.current?.value || ''
    setFilter({ keyword: keyword })
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
