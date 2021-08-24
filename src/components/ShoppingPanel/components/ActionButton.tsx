import styled from '@emotion/styled'
import { Button, ButtonProps } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import TableChartIcon from '@material-ui/icons/TableChart'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { ShoppingState } from '@/components/ShoppingPanel/hooks'
import { Analytics } from '@/context/Analytics/components/Analytics'
import { LinkWithAnalytics } from '@/context/Analytics/components/LinkWithAnalytics'
import { SHOPPING_CART_BUTTON, SHOPPING_CART_REMOVE_COURSE } from '@/context/Analytics/components/const'
import { useShoppingCardModal } from '@/context/ShoppingCartModal'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

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
  const { studyProgram } = useCourseGroup()
  const href = `/${studyProgram}/schedule`
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
