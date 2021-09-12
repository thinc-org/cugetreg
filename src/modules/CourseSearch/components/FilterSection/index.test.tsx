import { DayOfWeekEnum, GenEdTypeEnum } from '@thinc-org/chula-courses'
import { shallow } from 'enzyme'

import { ResponsiveDialog } from '@/common/components/ResponsiveDialog'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { DAY_FILTER, GENED_FILTER } from '@/common/context/Analytics/constants'
import { Button, StickyPaper } from '@/modules/CourseSearch/components/FilterSection/styles'

describe('FilterSection', () => {
  const mockUseMediaQuery = jest.fn()
  const mockUseFilterBar = jest.fn(() => ({
    checkboxes: [],
  }))
  const MOCK_HASTAG = true
  const mockUseHasTags = jest.fn(() => MOCK_HASTAG)

  const MOCK_QUERY = 'query'
  const mockUseTheme = jest.fn(() => ({
    breakpoints: {
      up: jest.fn(() => MOCK_QUERY),
    },
  }))
  jest.doMock('@material-ui/core/useMediaQuery', () => mockUseMediaQuery)
  jest.doMock('./hooks/useFilterBar', () => ({ useFilterBar: mockUseFilterBar }))
  jest.doMock('../TagList', () => ({ useHasTags: mockUseHasTags }))
  jest.doMock('@emotion/react', () => ({ ...jest.requireActual('@emotion/react'), useTheme: mockUseTheme }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each`
    matchSmallScreen | isExpandFilter
    ${true}          | ${true}
    ${true}          | ${false}
    ${false}         | ${true}
    ${false}         | ${false}
  `(
    'Should matched snapshot correctly when matchSmallScreen=$matchSmallScreen and isExpandFilter=$isExpandFilter',
    async ({ matchSmallScreen, isExpandFilter }) => {
      const { FilterSection } = await import('.')
      const mockHandleClose = jest.fn()
      mockUseMediaQuery.mockReturnValue(matchSmallScreen)

      const wrapper = shallow(<FilterSection open={isExpandFilter} handleClose={mockHandleClose} />)

      expect(mockUseMediaQuery).toBeCalledWith(MOCK_QUERY)
      expect(mockUseTheme).toBeCalledTimes(1)
      expect(mockUseHasTags).toBeCalledTimes(1)
      expect(mockUseFilterBar).toBeCalledTimes(2)
      expect(mockUseFilterBar).toHaveBeenNthCalledWith(
        1,
        [
          {
            label: 'หมวดวิทย์',
            value: GenEdTypeEnum.SC,
          },
          {
            label: 'หมวดสังคม',
            value: GenEdTypeEnum.SO,
          },
          {
            label: 'หมวดมนุษย์',
            value: GenEdTypeEnum.HU,
          },
          {
            label: 'หมวดสหฯ',
            value: GenEdTypeEnum.IN,
          },
          {
            label: 'ไม่ใช่ GenEd',
            value: GenEdTypeEnum.NO,
          },
        ],
        'genEdTypes'
      )
      expect(mockUseFilterBar).toHaveBeenNthCalledWith(
        2,
        [
          {
            label: 'วันจันทร์',
            value: DayOfWeekEnum.Monday,
          },
          {
            label: 'วันอังคาร',
            value: DayOfWeekEnum.Tuesday,
          },
          {
            label: 'วันพุธ',
            value: DayOfWeekEnum.Wednesday,
          },
          {
            label: 'วันพฤหัสบดี',
            value: DayOfWeekEnum.Thursday,
          },
          {
            label: 'วันศุกร์',
            value: DayOfWeekEnum.Friday,
          },
          {
            label: 'วันเสาร์',
            value: DayOfWeekEnum.Saturday,
          },
          {
            label: 'วันอาทิตย์',
            value: DayOfWeekEnum.Sunday,
          },
        ],
        'dayOfWeeks'
      )

      if (!matchSmallScreen) {
        expect(wrapper.find(ResponsiveDialog).prop('onClose')).toBe(mockHandleClose)
        expect(wrapper.find(Button).prop('onClick')).toBe(mockHandleClose)
      }
      if (matchSmallScreen && isExpandFilter) {
        expect(wrapper.find(StickyPaper).prop('hasTags')).toBe(MOCK_HASTAG)
      }
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    matchSmallScreen | isExpandFilter
    ${true}          | ${true}
    ${false}         | ${true}
    ${false}         | ${false}
  `(
    'Should render CheckboxGroup of GenEds correctly when when matchSmallScreen=$matchSmallScreen and isExpandFilter=$isExpandFilter',
    async ({ matchSmallScreen, isExpandFilter }) => {
      const { FilterSection } = await import('.')
      const mockHandleClose = jest.fn()
      mockUseMediaQuery.mockReturnValue(matchSmallScreen)

      const wrapper = shallow(<FilterSection open={isExpandFilter} handleClose={mockHandleClose} />)
        .find(Analytics)
        .findWhere((n) => n.prop('elementName') === GENED_FILTER)
        .renderProp('children')({ log: () => {} })
      expect(wrapper).toMatchSnapshot()
    }
  )

  it.each`
    matchSmallScreen | isExpandFilter
    ${true}          | ${true}
    ${false}         | ${true}
    ${false}         | ${false}
  `(
    'Should render CheckboxGroup of days correctly when matchSmallScreen=$matchSmallScreen and isExpandFilter=$isExpandFilter',
    async ({ matchSmallScreen, isExpandFilter }) => {
      const { FilterSection } = await import('.')
      const mockHandleClose = jest.fn()
      mockUseMediaQuery.mockReturnValue(matchSmallScreen)

      const wrapper = shallow(<FilterSection open={isExpandFilter} handleClose={mockHandleClose} />)
        .find(Analytics)
        .findWhere((n) => n.prop('elementName') === DAY_FILTER)
        .renderProp('children')({ log: () => {} })
      expect(wrapper).toMatchSnapshot()
    }
  )
})

shallow
