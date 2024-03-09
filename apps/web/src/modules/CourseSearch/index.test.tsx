import React from 'react'

import { shallow } from 'enzyme'
import { describe, expect, it, vi } from 'vitest'

describe('CourseSearchPage', () => {
  const mockOpenFilterBar = false
  const mockAcademicYear = '2564'
  const mockSemester = '1'

  const setTermSpy = vi.fn()
  const setOpenFilterBarSpy = vi.fn()
  const useCourseSearchPageSpy = vi.fn(() => ({
    openFilterBar: mockOpenFilterBar,
    setOpenFilterBar: setOpenFilterBarSpy,
    onOpen: vi.fn(),
  }))

  vi.doMock('./hooks/useCourseSearchPage', () => ({
    useCourseSearchPage: useCourseSearchPageSpy,
  }))
  vi.doMock('@web/services/apollo', () => ({
    client: { mutate: vi.fn() },
  }))
  vi.doMock('@web/common/hooks/useCourseGroup', () => ({
    useCourseGroup: () => ({
      academicYear: mockAcademicYear,
      semester: mockSemester,
      setTerm: setTermSpy,
    }),
  }))

  it('Should match snapshot correctly', async () => {
    const { CourseSearchPage } = await import('.')

    const wrapper = shallow(<CourseSearchPage />)
    expect(wrapper).toMatchSnapshot()
  })
})
