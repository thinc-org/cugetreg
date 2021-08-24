import { ThemeProvider } from '@material-ui/core'
import { render } from '@testing-library/react'
import { GenEdTypeEnum, DayOfWeekEnum } from '@thinc-org/chula-courses'

import mockAndShallowSpy from '@/common/testing/mockAndShallowSpy'
import { lightTheme } from '@/configs/theme'

import { GeneralChipProps } from '.'
import { GeneralChipKey } from './config'

describe('Chip', () => {
  const [muiChipSpy, resetMuiChipSpy] = mockAndShallowSpy('@material-ui/core/Chip')

  afterEach(() => {
    resetMuiChipSpy()
  })

  it.each`
    value
    ${DayOfWeekEnum.Monday}
    ${DayOfWeekEnum.Tuesday}
    ${DayOfWeekEnum.Wednesday}
    ${DayOfWeekEnum.Thursday}
    ${DayOfWeekEnum.Friday}
    ${DayOfWeekEnum.Saturday}
    ${DayOfWeekEnum.Sunday}
  `(`should return chips with filled color, $value.label`, async ({ value }: { value: GeneralChipProps['type'] }) => {
    const { default: GeneralChip } = await import('.')

    render(
      <ThemeProvider theme={lightTheme}>
        <GeneralChip type={value} />
      </ThemeProvider>
    )

    expect(muiChipSpy).toBeCalledTimes(1)
    expect(muiChipSpy.mock.calls[0][0].variant).not.toBeDefined()
  })

  it.each`
    value
    ${GenEdTypeEnum.SO}
    ${GenEdTypeEnum.SC}
    ${GenEdTypeEnum.HU}
    ${GenEdTypeEnum.IN}
  `(`should return chips with outlined color, $value.label`, async ({ value }: { value: GeneralChipKey }) => {
    const { default: GeneralChip } = await import('.')

    render(
      <ThemeProvider theme={lightTheme}>
        <GeneralChip type={value} />
      </ThemeProvider>
    )

    expect(muiChipSpy).toBeCalledTimes(1)
    expect(muiChipSpy.mock.calls[0][0].variant).toEqual('outlined')
  })
})
