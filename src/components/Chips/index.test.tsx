import { render } from '@testing-library/react'
import GeneralChip from '.'
import { chipConfig, GeneralChipKey } from './config'

describe('Chip test', () => {
  const typeList = Object.keys(chipConfig) as GeneralChipKey[]

  typeList.forEach((value) => {
    it(`Should be created using type=${value}`, () => {
      const generalChip = render(<GeneralChip type={value} />)
      expect(generalChip).toBeTruthy()
    })
  })
})
