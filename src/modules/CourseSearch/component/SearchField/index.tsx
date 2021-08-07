import { IconButton, InputBase, Paper } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Analytics } from '@/context/analytics/components/Analytics'
import { COURSE_SEARCH_BOX } from '@/context/analytics/components/const'
import { SEARCH_QUERY } from '@/context/analytics/components/const'
import { useLog } from '@/context/analytics/components/useLog'
import { useStyles } from '@/modules/CourseSearch/component/SearchField/styled'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const classes = useStyles()
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()
  const [input, setInput] = useState(() => searchCourseQueryParams.filter.keyword || '')
  const lastSubmittedInput = useRef(input)
  const { log } = useLog(SEARCH_QUERY)
  const timeoutRef = useRef<number>(0)

  useEffect(() => {
    setInput(searchCourseQueryParams.filter.keyword || '')
  }, [searchCourseQueryParams.filter.keyword])

  const submit = useCallback(
    (keyword: string) => {
      if (lastSubmittedInput.current === keyword) {
        return
      }
      lastSubmittedInput.current = keyword
      setFilter({ ...searchCourseQueryParams.filter, keyword: keyword })
      const detail = JSON.stringify({ ...searchCourseQueryParams.filter, keyword })
      log(null, detail)
    },
    [setFilter, searchCourseQueryParams.filter, log]
  )

  const onSubmit = useCallback(
    (event?: React.FormEvent<HTMLFormElement>) => {
      event?.preventDefault()
      submit(input)
    },
    [submit, input]
  )

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      onSubmit()
    }, 500)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [input])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setInput('')
    submit('')
  }, [submit])

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <Analytics elementName={COURSE_SEARCH_BOX}>
        <InputBase
          fullWidth
          value={input}
          onChange={handleChange}
          placeholder="ค้นหารหัสวิชา / ชื่อวิชา"
          margin="dense"
          className={classes.input}
        />
      </Analytics>
      {input ? (
        <IconButton aria-label="clear" className={classes.iconButton} onClick={handleClear}>
          <CloseIcon />
        </IconButton>
      ) : (
        <IconButton type="submit" aria-label="search" className={classes.iconButton}>
          <SearchIcon />
        </IconButton>
      )}
    </Paper>
  )
}
