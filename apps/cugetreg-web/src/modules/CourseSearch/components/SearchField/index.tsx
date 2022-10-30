import React, { useCallback, useEffect, useRef, useState } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, OutlinedInput, Paper } from '@mui/material'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { COURSE_SEARCH_BOX } from '@web/common/context/Analytics/constants'
import { SEARCH_QUERY } from '@web/common/context/Analytics/constants'
import { useLog } from '@web/common/context/Analytics/hooks/useLog'
import { useSearchCourseQueryParams } from '@web/modules/CourseSearch/hooks/useSearchCourseQueryParams'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = () => {
  const { setFilter, searchCourseQueryParams } = useSearchCourseQueryParams()
  const [input, setInput] = useState(() => searchCourseQueryParams.filter.keyword || '')
  const { log } = useLog(SEARCH_QUERY)

  useEffect(() => {
    setInput(searchCourseQueryParams.filter.keyword || '')
  }, [searchCourseQueryParams.filter.keyword])

  const submit = useCallback(
    (keyword: string) => {
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
