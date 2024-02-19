import { shallow } from 'enzyme'
import { describe, expect, it, vi } from 'vitest'

import { SelectTimeTitle } from './styled'

describe('SelectTime', () => {
  const I18N_NAME = 'filterBar'

  const onCheckboxChangeSpy = vi.fn()
  const onEndTimeChangeSpy = vi.fn()
  const onStartTimeChangeSpy = vi.fn()
  const mockStartTimeChoices = ['10:30', '11:00', '11:30', '12:00', '12:30']
  const mockEndTimeChoices = ['11:30', '12:00', '12:30', '13:00', '13:30']
  const mockStartTime = '11:30'
  const mockEndTime = '11:30'

  const mockLog = vi.fn()

  const mockUseSelectTime = vi.fn(() => ({
    selectedStartTime: mockStartTime,
    selectedEndTime: mockEndTime,
    startTimeChoices: mockStartTimeChoices,
    endTimeChoices: mockEndTimeChoices,
    onStartTimeChange: onStartTimeChangeSpy,
    onEndTimeChange: onEndTimeChangeSpy,
    checked: true,
    onCheckboxChange: onCheckboxChangeSpy,
  }))
  vi.doMock('./hooks/useSelectTime', () => ({ useSelectTime: mockUseSelectTime }))

  const translateSpy = vi.fn((text) => text)
  const useTranslationSpy = vi.fn(() => ({ t: translateSpy }))

  vi.doMock('react-i18next', () => ({
    useTranslation: useTranslationSpy,
  }))

  it('Should render correctly', async () => {
    const { SelectTime } = await import('.')

    const wrapper = shallow(<SelectTime log={mockLog} />)

    expect(useTranslationSpy).toBeCalledWith(I18N_NAME)
    expect(useTranslationSpy).toBeCalledTimes(1)

    expect(wrapper.find(SelectTimeTitle).text()).toMatch('periodRange')

    expect(wrapper).toMatchSnapshot()
  })
})
