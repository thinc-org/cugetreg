import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, OutlinedInput, Paper } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { COURSE_SEARCH_BOX } from '@/common/context/Analytics/constants'
import { SEARCH_QUERY } from '@/common/context/Analytics/constants'
import { useLog } from '@/common/context/Analytics/hooks/useLog'
import { useSearchCourseQueryParams } from '@/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }, [])

  const handleClear = useCallback(() => {
    setInput('')
    submit('')
  }, [submit])

  return (
    <Paper component="form" noValidate onSubmit={onSubmit} elevation={0} sx={{ width: '100%' }}>
      <Analytics elementName={COURSE_SEARCH_BOX}>
        <OutlinedInput
          sx={{ pr: 0.5 }}
          fullWidth
          value={input}
          onChange={handleChange}
          placeholder="ค้นหารหัสวิชา / ชื่อวิชา"
          endAdornment={
            input ? (
              <IconButton aria-label="clear" onClick={handleClear}>
                <CloseIcon />
              </IconButton>
            ) : (
              <IconButton type="submit" aria-label="search">
                <SearchIcon />
              </IconButton>
            )
          }
        />
      </Analytics>
    </Paper>
  )
}
