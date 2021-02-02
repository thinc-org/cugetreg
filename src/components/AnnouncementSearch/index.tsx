import { useStyles, Container } from './styles'
import useAnnouncementSearch from './useAnnouncementSearch'
import { DatePicker } from '@/components/DatePicker'
import FormControl from '@material-ui/core/FormControl'
import { Select } from '@/components/Select'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'
import { useSharedStyles } from '@/styles/shared'
import { useTranslation } from 'react-i18next'

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
  const classes = useStyles()
  const sharedClasses = useSharedStyles()
  const { t } = useTranslation('annuncementSearch')

  return (
    <form noValidate onSubmit={submit}>
      <Container>
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
      </Container>
    </form>
  )
}
