import { FormControlLabel } from '@material-ui/core'
import { shallow } from 'enzyme'

import { SelectTimeTitle } from './styled'

describe('SelectTime', () => {
  const I18N_NAME = 'filterBar'

  const mockOnCheckboxChange = jest.fn()
  const mockOnEndTimeChange = jest.fn()
  const mockOnStartTimeChange = jest.fn()
  const MOCK_START_CHOICES = ['10:30', '11:00', '11:30', '12:00', '12:30']
  const MOCK_ENDTIME_CHOICES = ['11:30', '12:00', '12:30', '13:00', '13:30']
  const MOCK_START_TIME = '11:30'
  const MOCK_END_TIME = '11:30'

  const mockLog = jest.fn()

  const mockUseSelectTime = jest.fn(() => ({
    selectedStartTime: MOCK_START_TIME,
    selectedEndTime: MOCK_END_TIME,
    startTimeChoices: MOCK_START_CHOICES,
    endTimeChoices: MOCK_ENDTIME_CHOICES,
    onStartTimeChange: mockOnStartTimeChange,
    onEndTimeChange: mockOnEndTimeChange,
    checked: true,
    onCheckboxChange: mockOnCheckboxChange,
  }))
  jest.doMock('./hooks/useSelectTime', () => ({ useSelectTime: mockUseSelectTime }))

  const mockTranslate = jest.fn((text) => text)
  const mockUseTranslation = jest.fn(() => ({ t: mockTranslate }))

  jest.doMock('react-i18next', () => ({
    useTranslation: mockUseTranslation,
  }))

  it('Should render correctly', async () => {
    const { SelectTime } = await import('.')

    const wrapper = shallow(<SelectTime log={mockLog} />)

    expect(mockUseTranslation).toBeCalledWith(I18N_NAME)
    expect(mockUseTranslation).toBeCalledTimes(1)

    expect(wrapper.find(SelectTimeTitle).text()).toMatch('periodRange')

    expect(wrapper).toMatchSnapshot()
  })
})
