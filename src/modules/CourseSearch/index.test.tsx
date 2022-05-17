import { shallow } from 'enzyme'

import React from 'react'

describe('CourseSearchPage', () => {
  const mockOpenFilterBar = false
  const mockAcademicYear = '2564'
  const mockSemester = '1'

  const setTermSpy = jest.fn()
  const setOpenFilterBarSpy = jest.fn()
  const useCourseSearchPageSpy = jest.fn(() => ({
    openFilterBar: mockOpenFilterBar,
    setOpenFilterBar: setOpenFilterBarSpy,
    onOpen: jest.fn(),
  }))

  jest.doMock('./hooks/useCourseSearchPage', () => ({
    useCourseSearchPage: useCourseSearchPageSpy,
  }))
  jest.doMock('@/services/apollo', () => ({
    initializeApollo: jest.fn(),
  }))
  jest.doMock('@/common/hooks/useCourseGroup', () => ({
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
