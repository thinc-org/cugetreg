import { Button } from '@material-ui/core'
import FilterListIcon from '@material-ui/icons/FilterList'
import React from 'react'

export interface FilterIconButtonProps {
  onClick: () => void
}

export const FilterIconButton: React.FC<FilterIconButtonProps> = ({ onClick }) => {
  return (
    <Button
      sx={{ '& .MuiButton-startIcon': { margin: 0 } }}
      startIcon={<FilterListIcon />}
      variant="outlined"
      size="small"
      onClick={onClick}
    />
  )
}
