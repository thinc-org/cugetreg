import React from 'react'
import { MdCheck } from 'react-icons/md'

import Add from '@mui/icons-material/Add'
import { LoadingButton } from '@mui/lab'
import { observer } from 'mobx-react'

import { useSelectButton } from '@web/common/components/SelectButton/hooks/useSelectButton'

import { SelectButtonProps } from './types'

export const SelectButton = observer((props: SelectButtonProps) => {
  const { t, isSelected, onClickSelectCourse } = useSelectButton(props)

  return (
    <LoadingButton
      loading={false}
      startIcon={!isSelected ? <Add /> : <MdCheck />}
      color="primary"
      variant={!isSelected ? 'contained' : 'outlined'}
      fullWidth
      disableElevation
      onClick={onClickSelectCourse}
    >
      {t('select')}
    </LoadingButton>
  )
})
