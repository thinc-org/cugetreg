import { Button } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import React from 'react'

import { useStyles } from '@/modules/CourseSearch/components/FilterIconButton/styled'

export interface FilterIconButtonProps {
  onClick: () => void
}

export const FilterIconButton: React.FC<FilterIconButtonProps> = ({ onClick }) => {
  const classes = useStyles()

  return (
    <Button
      className={classes.button}
      startIcon={<FilterListIcon />}
      variant="outlined"
      size="small"
      onClick={onClick}
    />
  )
}
