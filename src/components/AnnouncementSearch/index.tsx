import { useTranslation } from 'react-i18next'

import { DatePicker } from '@/components/DatePicker'
import { Select } from '@/components/Select'
import { useSharedStyles } from '@/styles/shared'
import { Button, FormControl, Input, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import { AnnouncementSearchContainer, useStyles } from './styles'
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
  const sharedClasses = useSharedStyles()
  const classes = useStyles()
  const { t } = useTranslation('annuncementSearch')

  return (
    <form noValidate onSubmit={submit}>
      <AnnouncementSearchContainer>
        <FormControl className={sharedClasses.inputField}>
          <Input
            placeholder={t('searchPlaceholder')}
            name="keyword"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon className={classes.search} />
              </InputAdornment>
            }
            value={keyword}
            inputProps={{
              className: classes.input,
            }}
            disableUnderline={true}
            onChange={handleKeywordChange}
          />
        </FormControl>
        <DatePicker name="date" value={date} onChange={handleDateChange} />
        <Select name="categories" onChange={handleCategoryChange} items={categories} value={category} />
        <Select name="faculties" onChange={handleFacultyChange} items={faculties} value={faculty} />
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          {t('search')}
        </Button>
      </AnnouncementSearchContainer>
    </form>
  )
}
