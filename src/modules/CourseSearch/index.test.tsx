import { shallow } from 'enzyme'
import React from 'react'

describe('CourseSearchPage', () => {
  const mockOpenFilterBar = false
  const mockSetOpenFilterBar = jest.fn()
  const mockUseCourseSearchPage = jest.fn(() => ({
    openFilterBar: mockOpenFilterBar,
    setOpenFilterBar: mockSetOpenFilterBar,
    onOpen: jest.fn(),
  }))
  jest.doMock('./hooks/useCourseSearchPage', () => ({
    useCourseSearchPage: mockUseCourseSearchPage,
  }))
  jest.doMock('@/services/apollo', () => ({
    client: { mutate: jest.fn() },
  }))

  it('Should match snapshot correctly', async () => {
    const { CourseSearchPage } = await import('.')

    const wrapper = shallow(<CourseSearchPage />)
    expect(wrapper).toMatchSnapshot()
  })
})
