import { IconButton, Popover, Typography, Container, IconButtonProps } from '@material-ui/core'
import { shallow } from 'enzyme'

describe('NoSeatIcon', () => {
  const mockOnHover = jest.fn()
  const mockOnLeave = jest.fn()
  const mockTranslate = jest.fn()
  const mockOpen = jest.fn()
  const mockRef = { current: 'current' }
  const mockAnchorEl = document.createElement('a') as Element

  const mockUseNoSeatIcon = jest.fn(() => ({
    anchorEl: mockAnchorEl,
    onHover: mockOnHover,
    onLeave: mockOnLeave,
    t: mockTranslate,
    open: mockOpen,
    containerRef: mockRef,
  }))

  jest.doMock('./hooks/useNoSeatIcon', () => ({
    useNoSeatIcon: mockUseNoSeatIcon,
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    open
    ${true}
    ${false}
  `('Should render correctly when open is $open', async ({ open }) => {
    const { NoSeatIcon } = await import('.')
    const MOCK_PROPS = { color: 'primary' as any }
    const wrapper = shallow(<NoSeatIcon {...MOCK_PROPS} />)

    const TRANSLATE_TEXT = 'notice'

    expect(mockTranslate).toBeCalledTimes(1)
    expect(mockTranslate).toBeCalledWith(TRANSLATE_TEXT)
    expect(mockUseNoSeatIcon).toBeCalledTimes(1)
    expect(mockUseNoSeatIcon).toBeCalledWith()

    expect(wrapper.find(IconButton).prop('onMouseEnter')).toBe(mockOnHover)
    expect(wrapper.find(IconButton).prop('onMouseLeave')).toBe(mockOnLeave)
    expect(wrapper.find(Popover).prop('anchorEl')).toBe(mockAnchorEl)
    expect(wrapper.find(Popover).prop('onClose')).toBe(mockOnLeave)
    expect(wrapper.find(Popover).prop('open')).toBe(mockOpen)
    expect(wrapper.find(Popover).prop('container')).toBe(mockRef.current)

    expect(wrapper).toMatchSnapshot()
  })
})
