import { Typography } from '@mui/material'

import { GenEdTableHeaderContainer } from '../styled'

export function GenEdTableHeader() {
  return (
    <GenEdTableHeaderContainer>
      <Typography sx={{ fontWeight: 700 }}>Context</Typography>
      <Typography sx={{ fontWeight: 700 }}>Number</Typography>
      <Typography sx={{ fontWeight: 700, justifySelf: 'start' }}>Course title</Typography>
      <Typography sx={{ fontWeight: 700 }}></Typography>
    </GenEdTableHeaderContainer>
  )
}
