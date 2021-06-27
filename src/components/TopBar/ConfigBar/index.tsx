import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import { ConfigBarItem } from './ConfigBarItem'
import { useTranslation } from 'react-i18next'
import styled from '@emotion/styled'
import { useCourseGroup } from '@/utils/hooks/useCourseGroup'

import StudyProgramDropdown from '../components/StudyProgramDropdown'

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

  const { academicYear, semester } = useCourseGroup()
  return (
    <ConfigBarLayout>
      <FlexContainer>
        <FlexOne />
        {/* TODO: implement the dropdowns */}
        <StudyProgramDropdown />
        <ConfigBarItem>
          {academicYear}/{semester}
        </ConfigBarItem>
        <ConfigBarItem>
          <a href="https://airtable.com/shruwAAfn1763TgMU" target="_blank" rel="noreferrer" style={{ color: 'white' }}>
            {t('reportAProblem')}
          </a>
        </ConfigBarItem>
      </FlexContainer>
    </ConfigBarLayout>
  )
}
