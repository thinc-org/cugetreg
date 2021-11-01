import { FormControlLabel } from '@material-ui/core'
import { shallow } from 'enzyme'

import { SelectTimeTitle } from './styled'

describe('SelectTime', () => {
  const I18N_NAME = 'filterBar'

  const onCheckboxChangeSpy = jest.fn()
  const onEndTimeChangeSpy = jest.fn()
  const onStartTimeChangeSpy = jest.fn()
  const mockStartTimeChoices = ['10:30', '11:00', '11:30', '12:00', '12:30']
  const mockEndTimeChoices = ['11:30', '12:00', '12:30', '13:00', '13:30']
  const mockStartTime = '11:30'
  const mockEndTime = '11:30'

  const mockLog = jest.fn()

  const mockUseSelectTime = jest.fn(() => ({
    selectedStartTime: mockStartTime,
    selectedEndTime: mockEndTime,
    startTimeChoices: mockStartTimeChoices,
    endTimeChoices: mockEndTimeChoices,
    onStartTimeChange: onStartTimeChangeSpy,
    onEndTimeChange: onEndTimeChangeSpy,
    checked: true,
    onCheckboxChange: onCheckboxChangeSpy,
  }))
  jest.doMock('./hooks/useSelectTime', () => ({ useSelectTime: mockUseSelectTime }))

  const translateSpy = jest.fn((text) => text)
  const useTranslationSpy = jest.fn(() => ({ t: translateSpy }))

  jest.doMock('react-i18next', () => ({
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
