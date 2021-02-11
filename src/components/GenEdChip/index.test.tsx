/* eslint-disable @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react'
import * as ChipType from '.'

describe('Chip', () => {
  const useThemeSpy = jest.fn().mockReturnValue({ palette: { background: { paper: '' } } })
  const EnhancedShipSpy = jest.fn().mockReturnValue(<div></div>)
  const genedColorMapperSpy = jest.fn().mockReturnValue('')
  const translateSpy = jest.fn().mockReturnValue('')
  const useTranslationSpy = jest.fn().mockReturnValue({ t: translateSpy })

  jest.doMock('@material-ui/core', () => ({ useTheme: useThemeSpy }))
  jest.doMock('./utils', () => ({ genedColorMapper: genedColorMapperSpy }))
  jest.doMock('./styles', () => ({ EnhancedChip: EnhancedShipSpy }))
  jest.doMock('react-i18next', () => ({ useTranslation: useTranslationSpy }))

  const { GenEdChip } = require('.') as typeof ChipType

  it('shoulde be able to create', () => {
    const chip = render(<GenEdChip category="SC" />)
    expect(chip).toBeTruthy()
  })
})
