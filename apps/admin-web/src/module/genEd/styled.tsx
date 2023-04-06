import { styled } from '@mui/material'

export const GenEdTableHeaderContainer = styled('div')`
  display: grid;
  grid-template-columns: 160px 70px 280px 1fr 160px;
  border-bottom: 2px solid #e5e7eb;
  column-gap: 24px;
  align-items: center;
  justify-items: center;
  padding: 16px 88px 16px 24px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`

export const GenEdTableBody = styled('div')`
  display: grid;
  grid-template-columns: 160px 70px 280px 1fr 224px;
  column-gap: 24px;
  align-items: center;
  justify-items: center;
  padding: 16px 24px;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
`

export const GenEdCreditContainer = styled(`div`)`
  display: grid;
  grid-template-columns: 160px 40px 24px;
`
