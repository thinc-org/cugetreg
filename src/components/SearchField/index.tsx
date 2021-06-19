import React from 'react'

import { useSearchField } from '@/components/SearchField/hooks'
import { useStyles } from '@/components/SearchField/styled'
import { IconButton, InputBase, Paper, TextField } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

export interface SeachFieldProp {}

export const SearchField: React.FC<SeachFieldProp> = (props) => {
  const classes = useStyles()
  const { inputRef, onSubmit } = useSearchField()

  return (
    <Paper component="form" className={classes.root} noValidate onSubmit={onSubmit} variant="outlined">
      <InputBase
        fullWidth
        inputRef={inputRef}
        placeholder="ค้นหารหัสวิชา / ชื่อวิชา"
        margin="dense"
        className={classes.input}
      />
      <IconButton type="submit" aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}
