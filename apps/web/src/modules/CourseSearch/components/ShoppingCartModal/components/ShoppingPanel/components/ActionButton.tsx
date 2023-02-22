import React from 'react'
import { useTranslation } from 'react-i18next'

import DeleteIcon from '@mui/icons-material/Delete'
import TableChartIcon from '@mui/icons-material/TableChart'
import { Button, ButtonProps, styled } from '@mui/material'
import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@web/common/context/Analytics/components/LinkWithAnalytics'
import {
  SHOPPING_CART_BUTTON,
  SHOPPING_CART_REMOVE_COURSE,
} from '@web/common/context/Analytics/constants'
import { useShoppingCardModal } from '@web/common/context/ShoppingCartModal'
import { useLinkBuilder } from '@web/common/hooks/useLinkBuilder'

import { ShoppingState } from '../hooks/useShoppingPanel'

const ErrorButton = styled(Button)`
  color: ${({ theme }) => theme.palette.error.main};
  border-color: ${({ theme }) => theme.palette.error.main};
`

export interface ActionButtonProps extends ButtonProps {
  status: ShoppingState
  selectedCoursesNumnber: number
  removeAllSelectedCourses: () => void
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  selectedCoursesNumnber,
  removeAllSelectedCourses,
  status,
  ...props
}) => {
  const { t } = useTranslation('shoppingPanel')
  const { buildLink } = useLinkBuilder()
  const href = buildLink(`/schedule`)
  const { onClose } = useShoppingCardModal()

  const defaultButtonProps: ButtonProps = {
    ...props,
    fullWidth: true,
    color: 'primary',
    variant: 'contained',
  }

  if (status === ShoppingState.Default) {
    return (
      <LinkWithAnalytics href={href} passHref elementName={SHOPPING_CART_BUTTON}>
        <Button {...defaultButtonProps} startIcon={<TableChartIcon />} onClick={onClose}>
          {t('makeSchedule.default')}
        </Button>
      </LinkWithAnalytics>
    )
  }

  return (
    <Analytics elementName={SHOPPING_CART_REMOVE_COURSE}>
      <ErrorButton
        {...defaultButtonProps}
        startIcon={<DeleteIcon />}
        variant="outlined"
        onClick={removeAllSelectedCourses}
      >
        {t('makeSchedule.delete', { number: selectedCoursesNumnber })}
      </ErrorButton>
    </Analytics>
  )
}
