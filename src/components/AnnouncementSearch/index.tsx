import { useStyles, Container } from './styles'
import useAnnouncementSearch from './useAnnouncementSearch'
import { KeyboardDatePicker } from '@material-ui/pickers'
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputAdornment from '@material-ui/core/InputAdornment'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import SearchIcon from '@material-ui/icons/Search'

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

  const CategoryItems = categories.map((categoryItem) => (
    <MenuItem key={categoryItem} value={categoryItem}>
      {categoryItem}
    </MenuItem>
  ))

  const FacultiesItems = faculties.map((faculty) => (
    <MenuItem key={faculty} value={faculty}>
      {faculty}
    </MenuItem>
  ))

  return (
    <form noValidate onSubmit={submit}>
      <Container>
        <FormControl className={classes.field}>
          <Input
            id="input-with-icon-adornment"
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
        <KeyboardDatePicker
          className={classes.field}
          keyboardIcon={<DateRangeOutlinedIcon />}
          value={date}
          disableFuture={true}
          onChange={handleDateChange}
          inputProps={{
            className: classes.input,
          }}
          InputProps={{
            disableUnderline: true,
          }}
          KeyboardButtonProps={{
            className: classes.dateIcon,
          }}
          format="dd/MM/yyyy"
        />
        <FormControl className={`${classes.field} ${classes.select}`}>
          <Select
            labelId="category-select"
            id="category"
            value={category}
            onChange={handleCategoryChange}
            inputProps={{
              className: classes.input,
            }}
            disableUnderline={true}
          >
            {CategoryItems}
          </Select>
        </FormControl>
        <FormControl className={`${classes.field} ${classes.select}`}>
          <Select
            labelId="faculty-select"
            id="faculty"
            value={faculty}
            onChange={handleFacultyChange}
            inputProps={{
              className: classes.input,
            }}
            disableUnderline={true}
          >
            {FacultiesItems}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" type="submit" className={classes.button}>
          ค้นหา
        </Button>
      </Container>
    </form>
  )
}
