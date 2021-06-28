import React, { useEffect, useState } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { collectLogEvent } from '@/utils/network/logging'
import { Analytics } from '@/context/analytics/components/Analytics'
import { COURSE_SEARCH_BOX } from '@/context/analytics/components/const'

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
    // TO DO: remove collectLogEvent and use log(null, JSON.stringify({ ...searchCourseQueryParams.filter, keyword })) instead
    collectLogEvent({
      kind: 'track',
      message: 'user query course',
      detail: JSON.stringify({ ...searchCourseQueryParams.filter, keyword }),
    })
  }

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <Analytics elementName={COURSE_SEARCH_BOX}>
        {({ log }) => (
          <InputBase
            onClick={log}
            fullWidth
            value={input}
            onChange={handleChange}
            placeholder="ค้นหารหัสวิชา / ชื่อวิชา"
            margin="dense"
            className={classes.input}
          />
        )}
      </Analytics>
      <IconButton type="submit" aria-label="search" className={classes.iconButton}>
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
