import { useTranslation } from 'react-i18next'

import { DatePicker } from '@/components/DatePicker'
import { Select } from '@/components/Select'
import { Button, FormControl, Input, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { useSharedStyles } from '@/styles/shared'

import { AnnouncementSearchContainer, useStyles } from './styles'
import useAnnouncementSearch from './useAnnouncementSearch'
import { CategorySearchTag, Faculty } from '@/utils/type'

export type OnSubmit = (keyword: string, date: Date | null, category: CategorySearchTag, faculty: string) => void

export interface AnnouncementSearchProps {
  categories: CategorySearchTag[]
  faculties: Faculty[]
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
  const { t } = useTranslation(['announcementSearch', 'faculty', 'category'])
  const facultiesTranslated = faculties.map((faculty) => ({ value: faculty, text: t(`faculty:${faculty}` as const) }))
  const categoriesTranslated = categories.map((category) => ({
    value: category,
    text: t(`category:${category}` as const),
  }))

  return (
    <form noValidate onSubmit={submit}>
      <AnnouncementSearchContainer>
        <FormControl className={sharedClasses.inputField}>
          <Input
            placeholder={t('announcementSearch:searchPlaceholder')}
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
        <Select name="categories" onChange={handleCategoryChange} items={categoriesTranslated} value={category} />
        <Select name="faculties" onChange={handleFacultyChange} items={facultiesTranslated} value={faculty} />
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          {t('announcementSearch:search')}
        </Button>
      </AnnouncementSearchContainer>
    </form>
  )
}
