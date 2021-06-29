import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useSearchCourseQueryParams } from '@/utils/hooks/useSearchCourseQueryParams'
import { Analytics } from '@/context/analytics/components/Analytics'
import { COURSE_SEARCH_BOX } from '@/context/analytics/components/const'
import { useLog } from '@/context/analytics/components/useLog'
import { SEARCH_QUERY } from '@/context/analytics/components/const'
import { collectLogEvent } from '@/utils/network/logging'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()
  const [input, setInput] = useState(() => searchCourseQueryParams.filter.keyword || '')
  const { log } = useLog(SEARCH_QUERY)
  const timeoutRef = useRef<number>(0)

  useEffect(() => {
    setInput(searchCourseQueryParams.filter.keyword || '')
  }, [searchCourseQueryParams.filter.keyword])

  const onSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault()
      const keyword = input
      setFilter({ ...searchCourseQueryParams.filter, keyword: keyword })
      const detail = JSON.stringify({ ...searchCourseQueryParams.filter, keyword })
      log(null, detail)
    },
    [setFilter, searchCourseQueryParams.filter, input, log]
  )

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      onSubmit()
    }, 1000)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [input])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
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
