import { useState } from 'react'

import { Typography } from '@mui/material'

import LogoutButton from '@admin-web/common/LogoutButton'

import SelectForm from './components/SelectForm'
import { LeftContainer, RightContainer, TopbarContainer } from './styled'

export default function Topbar() {
  const [year, setYear] = useState<string>('')
  const [sem, setSem] = useState<string>('')

  return (
    <TopbarContainer>
      <LeftContainer>
        <Typography sx={{ fontWeight: 700, fontSize: 36 }}>Review Approval</Typography>
      </LeftContainer>
      <RightContainer>
        <SelectForm
          name={YearSelectData.name}
          data={YearSelectData.data}
          value={year}
          setValue={setYear}
        />
        <SelectForm
          name={SemSelectData.name}
          data={SemSelectData.data}
          value={sem}
          setValue={setSem}
        />
        <LogoutButton />
      </RightContainer>
    </TopbarContainer>
  )
}

const YearSelectData = {
  name: 'year',
  data: [
    { text: 'Any', value: '' },
    { text: '2565', value: '2565' },
    { text: '2564', value: '2564' },
    { text: '2563', value: '2563' },
  ],
}

const SemSelectData = {
  name: 'sem',
  data: [
    { text: 'Any', value: '' },
    { text: '1', value: '1' },
    { text: '2', value: '2' },
    { text: '3', value: '3' },
  ],
}
