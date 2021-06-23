import styled from '@emotion/styled'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import { useTranslation } from 'react-i18next'
import { Button, IconButton } from '@material-ui/core'

const ButtonMobile = styled(IconButton)`
  border: 1px solid #2a2d48;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: right;
  padding: 5px 8px;
  color: ${({ theme }) => theme.palette.primaryRange[400]};
  ${({ theme }) => theme.breakpoints.up('sm')} {
    display: none;
  }
`

const ButtonDesktop = styled(Button)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

interface BackButtonProps {
  onClick?: () => void
}

export function BackButton(props: BackButtonProps) {
  const { t } = useTranslation('navigation')
  return (
    <>
      <ButtonDesktop {...props} startIcon={<ArrowBackIosIcon />} color="primary" variant="outlined" disableElevation>
        {t('back')}
      </ButtonDesktop>
      <ButtonMobile aria-label="back">
        <ArrowBackIosIcon />
      </ButtonMobile>
    </>
  )
}
