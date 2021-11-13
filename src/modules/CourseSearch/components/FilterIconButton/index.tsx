import FilterListIcon from '@mui/icons-material/FilterList'
import { Button } from '@mui/material'
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
