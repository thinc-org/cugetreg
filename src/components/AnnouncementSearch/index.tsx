import { useTranslation } from 'react-i18next'

import { DatePicker } from '@/components/DatePicker'
import { Select } from '@/components/Select'
import { useSharedStyles } from '@/styles/shared'
import { CategorySearchTag, Faculty } from '@/utils/type'
import { Button, FormControl, Input, InputAdornment } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

import useAnnouncementSearch from './useAnnouncementSearch'
import mapTextsToTranslatedItems from './utils/mapTextsToTranslatedItems'
import { AnnouncementSearchContainer, useStyles } from './styles'

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
  const { t } = useTranslation(['announcement', 'faculty'])

  const facultiesTranslated = mapTextsToTranslatedItems('faculty', faculties, t)
  const categoriesTranslated = mapTextsToTranslatedItems('announcement', categories, t, 'category')
  return (
    <form noValidate onSubmit={submit}>
      <AnnouncementSearchContainer>
        <FormControl className={sharedClasses.inputField}>
          <Input
            placeholder={t('announcement:searchPlaceholder')}
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
          {t('announcement:search')}
        </Button>
      </AnnouncementSearchContainer>
    </form>
  )
}
