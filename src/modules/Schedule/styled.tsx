import styled from '@emotion/styled'
import { Button, Theme, Typography } from '@material-ui/core'

export const PageContainer = styled.div`
  padding-top: ${({ theme }) => theme.spacing(4)};
`

export const Title = styled(Typography)`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`

export const InfoBar = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
    align-items: initial;
  }
`

export const ButtonBar = styled.div`
  display: flex;
  align-items: center;

  a,
  button {
    margin-right: ${({ theme }) => theme.spacing(2)};
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-top: ${({ theme }) => theme.spacing(2)};
    a,
    button {
      margin-right: ${({ theme }) => theme.spacing(1)};
    }
  }
`

export const InfoSpacer = styled.div`
  flex: 1;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    flex-direction: column;
  }
`

export const TabContainer = styled.div`
  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: flex;
    justify-content: center;

    > button {
      width: 50%;
    }
  }
`

interface TabButtonProps {
  current: number
  theme?: Theme
}

export const TabButton = styled(Button)<TabButtonProps>`
  width: 150px;
  ${({ current, theme }) => current && `background-color: ${theme?.palette.primaryRange[10]}`};
`

export const ExamContainer = styled.div<{ enabled: boolean }>`
  display: ${({ enabled }) => (!enabled ? 'none' : 'block')};
`

interface ScheduleContainerProps {
  enabled: boolean
}

export const ScheduleContainer = styled.div<ScheduleContainerProps>`
  ${({ enabled }) => !enabled && `display: none`};

  @media (max-width: 747px) {
    overflow-x: scroll;
    overflow-y: hidden;
  }

  > div {
    overflow: visible;
    min-width: 700px;
  }
`
