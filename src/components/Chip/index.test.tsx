/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
import * as ChipType from '.'
import { ChipShade } from './const'

describe('Chip', () => {
  const shadeMapperSpy = jest.fn().mockReturnValue({ textColor: '', backgroundColor: '' })

  jest.doMock('./utils', () => ({ shadeMapper: shadeMapperSpy }))

  const { default: Chip } = require('.') as typeof ChipType

  it('shoulde be able to create', () => {
    const chip = render(<Chip category="Test" shade={ChipShade.primaryRange} />)
    expect(chip).toBeTruthy()
  })
})
