import { act, renderHook } from '@testing-library/react-hooks'
import { afterEach, describe, expect, it, vi } from 'vitest'

describe('useFilterBar', () => {
  const mockSetFilter = vi.fn()
  const MOCK_GENEDTYPE = ['SO']
  const MOCK_DAYOFWEEK = ['TH', 'WE']
  const MOCK_SEARCH_QEURY_PARAM = {
    filter: { genEdypes: MOCK_GENEDTYPE, dayOfWeeks: MOCK_DAYOFWEEK },
  }
  const mockUseSearchCourseQueryParams = vi.fn(() => ({
    setFilter: mockSetFilter,
    searchCourseQueryParams: MOCK_SEARCH_QEURY_PARAM,
  }))
  const MOCK_ADDED_TAG = ['tag1', 'tag2']
  const MOCK_REMOVED_TAG = ['tag3']
  const mockAddTag = vi.fn(() => MOCK_ADDED_TAG)
  const mockRemoveTag = vi.fn(() => MOCK_REMOVED_TAG)

  vi.doMock('@web/modules/CourseSearch/hooks/useSearchCourseQueryParams', () => ({
    useSearchCourseQueryParams: mockUseSearchCourseQueryParams,
  }))
  vi.doMock('../../utils/addTag', () => ({
    addTag: mockAddTag,
  }))
  vi.doMock('../../utils/removeTag', () => ({
    removeTag: mockRemoveTag,
  }))

  afterEach(() => {
    vi.clearAllMocks()
  })

  const EXPECTED_CHECKBOXES = [
    { label: 'label', name: 'label', value: 'value', onChange: expect.any(Function) },
    { label: 'label2', name: 'label2', value: 'value2', onChange: expect.any(Function) },
  ]
  const INIT_CHECKBOXES = [
    { label: 'label', value: 'value' },
    { label: 'label2', value: 'value2' },
  ]

  it.each`
    type            | checked  | initCheckboxes     | expectedCheckboxes
    ${'genEdTypes'} | ${false} | ${[]}              | ${[]}
    ${'genEdTypes'} | ${false} | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
    ${'genEdTypes'} | ${true}  | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
  `(
    'Should setFilter correctly when type is genEdTypes, check is $checked and initCheckboxes is $initCheckboxes',
    async ({ type, initCheckboxes, checked, expectedCheckboxes }) => {
      const { useFilterBar } = await import('.')
      const { result } = renderHook(() => useFilterBar<any>(initCheckboxes, type))
      if (initCheckboxes.length !== 0) {
        act(() => {
          result.current.checkboxes[0].onChange(
            {
              target: { checked },
            } as React.ChangeEvent<HTMLInputElement>,
            checked
          )
        })
        expect(mockSetFilter).toBeCalledTimes(1)
        expect(mockSetFilter).toBeCalledWith({
          ...MOCK_SEARCH_QEURY_PARAM.filter,
          genEdTypes: checked ? MOCK_ADDED_TAG : MOCK_REMOVED_TAG,
        })
      }
      expect(result.current.checkboxes).toEqual(expectedCheckboxes)
    }
  )

  it.each`
    type            | checked  | initCheckboxes     | expectedCheckboxes
    ${'dayOfWeeks'} | ${false} | ${[]}              | ${[]}
    ${'dayOfWeeks'} | ${false} | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
    ${'dayOfWeeks'} | ${true}  | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
  `(
    'Should setFilter correctly when type is dayOfWeeks, check is $checked and initCheckboxes is $initCheckboxes',
    async ({ type, initCheckboxes, checked, expectedCheckboxes }) => {
      const { useFilterBar } = await import('.')
      const { result } = renderHook(() => useFilterBar<any>(initCheckboxes, type))
      if (initCheckboxes.length !== 0) {
        act(() => {
          result.current.checkboxes[0].onChange(
            {
              target: { checked },
            } as React.ChangeEvent<HTMLInputElement>,
            checked
          )
        })

        expect(mockSetFilter).toBeCalledTimes(1)
        expect(mockSetFilter).toBeCalledWith({
          ...MOCK_SEARCH_QEURY_PARAM.filter,
          dayOfWeeks: checked ? MOCK_ADDED_TAG : MOCK_REMOVED_TAG,
        })
      }
      expect(result.current.checkboxes).toEqual(expectedCheckboxes)
    }
  )

  it.each`
    type         | checked  | initCheckboxes     | expectedCheckboxes
    ${undefined} | ${false} | ${[]}              | ${[]}
    ${undefined} | ${false} | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
    ${undefined} | ${true}  | ${INIT_CHECKBOXES} | ${EXPECTED_CHECKBOXES}
  `(
    'Should setFilter correctly when type is undefined, check is $checked and initCheckboxes is $initCheckboxes',
    async ({ type, initCheckboxes, checked, expectedCheckboxes }) => {
      const { useFilterBar } = await import('.')
      const { result } = renderHook(() => useFilterBar<any>(initCheckboxes, type))
      if (initCheckboxes.length !== 0) {
        act(() => {
          result.current.checkboxes[0].onChange(
            {
              target: { checked },
            } as React.ChangeEvent<HTMLInputElement>,
            checked
          )
        })

        expect(mockSetFilter).not.toBeCalled()
      }
      expect(result.current.checkboxes).toEqual(expectedCheckboxes)
    }
  )
})
