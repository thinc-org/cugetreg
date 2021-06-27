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

const ConfigBarItemLink = ConfigBarItem.withComponent('a')

export const reportProblemLink = 'https://airtable.com/shruwAAfn1763TgMU'

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
        <ConfigBarItemLink href={reportProblemLink} target="_blank" rel="noreferrer">
          {t('reportAProblem')}
        </ConfigBarItemLink>
      </FlexContainer>
    </ConfigBarLayout>
  )
}
