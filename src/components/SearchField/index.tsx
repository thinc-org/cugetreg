import React, { useContext, useEffect, useState } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { CourseSearchContext } from '@/context/CourseSearch'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()
  const [input, setInput] = useState(() => searchCourseQueryParams.filter.keyword || '')

  useEffect(() => {
    setInput(searchCourseQueryParams.filter.keyword || '')
  }, [searchCourseQueryParams.filter.keyword])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const keyword = input
    setFilter({ ...searchCourseQueryParams.filter, keyword: keyword })
  }

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <InputBase
        fullWidth
        value={input}
        onChange={handleChange}
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
