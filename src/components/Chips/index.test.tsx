import { ThemeProvider } from '@material-ui/core'
import { render } from '@testing-library/react'

import { lightTheme } from '@/configs/theme'

import GeneralChip from '.'
import { chipConfig, GeneralChipKey } from './config'

describe('Chip test', () => {
  const typeList = Object.keys(chipConfig) as GeneralChipKey[]

  typeList.forEach((value) => {
    it(`Should be created using type=${value}`, () => {
      const generalChip = render(
        <ThemeProvider theme={lightTheme}>
          <GeneralChip type={value} />
        </ThemeProvider>
      )
      expect(generalChip).toBeTruthy()
    })
  })
})
