import { styled } from '@mui/material'

export const GenEdTableHeaderContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: '160px 70px 280px 1fr',
  borderBottom: '2px solid #e5e7eb',
  columnGap: '30px',
  alignItems: 'center',
  justifyItems: 'center',
  padding: '16px 88px 16px 24px',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '16px',
})

export const GenEdTableBody = styled('div')({
  display: 'grid',
  gridTemplateColumns: '160px 70px 280px 1fr 160px',
  columnGap: '30px',
  alignItems: 'center',
  justifyItems: 'center',
  padding: '16px 24px',
  fontStyle: 'normal',
  fontWeight: '700',
  fontSize: '16px',
})
