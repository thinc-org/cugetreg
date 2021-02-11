/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
import * as ChipType from '.'

describe('Chip', () => {
  const shadeMapperSpy = jest.fn().mockReturnValue({ textColor: '', backgroundColor: '' })

  jest.doMock('./utils', () => ({ shadeMapper: shadeMapperSpy }))

  const { GenEdChip } = require('.') as typeof ChipType

  it('shoulde be able to create', () => {
    const chip = render(<GenEdChip category="SC" />)
    expect(chip).toBeTruthy()
  })
})
