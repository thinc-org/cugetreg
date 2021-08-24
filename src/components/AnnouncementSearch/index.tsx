import { Button, FormControl, InputAdornment, OutlinedInput, Stack } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useTranslation } from 'react-i18next'

import { Select } from '@/common/components/Select'
import { DatePicker } from '@/components/DatePicker'

import useAnnouncementSearch from './useAnnouncementSearch'

export type OnSubmit = (keyword: string, date: Date | null, category: string, faculty: string) => void

export interface AnnouncementSearchProps {
  categories: string[]
  faculties: string[]
  onSubmit: OnSubmit
}

export const AnnouncementSearch = ({ categories, faculties, onSubmit }: AnnouncementSearchProps) => {
  const {
    keyword,
    date,
    category,
    faculty,
    handleFacultyChange,
    handleDateChange,
    handleCategoryChange,
    handleKeywordChange,
    submit,
  } = useAnnouncementSearch(onSubmit)
  const { t } = useTranslation('annuncementSearch')

  return (
    <form noValidate onSubmit={submit}>
      <Stack spacing={4.5} width={230}>
        <FormControl>
          <OutlinedInput
            placeholder={t('searchPlaceholder')}
            name="keyword"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            value={keyword}
            onChange={handleKeywordChange}
          />
        </FormControl>
        <DatePicker name="date" value={date} onChange={handleDateChange} />
        <Select name="categories" onChange={handleCategoryChange} items={categories} value={category} />
        <Select name="faculties" onChange={handleFacultyChange} items={faculties} value={faculty} />
        <Button variant="contained" color="primary" type="submit" sx={{ boxShadow: 0 }}>
          {t('search')}
        </Button>
      </Stack>
    </form>
  )
}
