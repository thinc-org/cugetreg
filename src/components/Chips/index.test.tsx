import { render } from '@testing-library/react'
import CustomChip from '.'
import { chipConfig, ChipKey } from './config'

describe('Chip test', () => {
  const typeList = Object.keys(chipConfig) as ChipKey[]

  typeList.forEach((value) => {
    it(`Should be created using type=${value}`, () => {
      const customChip = render(<CustomChip type={value} />)
      expect(customChip).toBeTruthy()
    })
  })
})
