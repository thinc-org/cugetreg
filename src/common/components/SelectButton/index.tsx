import Add from '@material-ui/icons/Add'
import { LoadingButton } from '@material-ui/lab'
import { observer } from 'mobx-react'
import React from 'react'
import { MdCheck } from 'react-icons/md'

import { useSelectButton } from '@/common/components/SelectButton/hooks/useSelectButton'

import { SelectButtonProps } from './types'

export const SelectButton = observer((props: SelectButtonProps) => {
  const { t, isSelected, isExperimentColor, onClickSelectCourse } = useSelectButton(props)

  return (
    <LoadingButton
      loading={false}
      startIcon={!isSelected ? <Add /> : <MdCheck />}
      color={isExperimentColor ? 'secondary' : 'primary'}
      variant={!isSelected ? 'contained' : 'outlined'}
      fullWidth
      disableElevation
      onClick={onClickSelectCourse}
    >
      {t('select')}
    </LoadingButton>
  )
})
