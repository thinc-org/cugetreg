import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import { ConfigBarItem } from './ConfigBarItem'
import { useTranslation } from 'react-i18next'
import StudyProgramDropdown from '../components/StudyProgramDropdown'
import styled from '@emotion/styled'

export const ConfigBarLayout = styled.div`
  width: 100%;
  height: 40px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primaryRange[10]};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

export function ConfigBar() {
  const { t } = useTranslation('configBar')
  return (
    <ConfigBarLayout>
      <FlexContainer>
        <FlexOne />
        {/* TODO: implement the dropdowns */}
        <StudyProgramDropdown />
        <ConfigBarItem>2563/2</ConfigBarItem>
        <ConfigBarItem>{t('reportAProblem')}</ConfigBarItem>
      </FlexContainer>
    </ConfigBarLayout>
  )
}
