import React, { useContext } from 'react'

import { Button } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'

import { useStyles } from '@/components/FilterIconButton/styled'
import { FilteredTagContext } from '@/context/FilteredTag'

export interface FilterIconButtonProps {}

export const FilterIconButton: React.FC<FilterIconButtonProps> = () => {
  const classes = useStyles()
  const { setOpenFilterBar } = useContext(FilteredTagContext)

  const onClick = () => {
    setOpenFilterBar((open) => !open)
  }

  return <Button className={classes.button} startIcon={<FilterListIcon />} variant="outlined" onClick={onClick} />
}
