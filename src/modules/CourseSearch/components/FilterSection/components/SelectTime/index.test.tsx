import { shallow } from 'enzyme'

describe('SelectTime', () => {
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

  it('Should render correctly', async () => {
    const { SelectTime } = await import('.')

    const wrapper = shallow(<SelectTime log={mockLog} />)

    expect(wrapper).toMatchSnapshot()
    // expect(wrapper.f)
  })
})
