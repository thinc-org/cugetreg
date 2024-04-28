import { shallow } from 'enzyme'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { mockMyPendingReviews, mockReviews } from '@web/__mock__/review'

describe('ReviewList', () => {
  const useReviewContextSpy = vi.fn()

  vi.doMock('@web/modules/CourseDetail/context/Review', () => ({
    useReviewContext: useReviewContextSpy,
  }))

  vi.doMock('@web/modules/CourseDetail/components/ReviewCard', () => ({
    ReviewCard: () => <>ReviewCard</>,
  }))

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render nothing if there are no reviews', async () => {
    useReviewContextSpy.mockReturnValue({
      myPendingReviews: [],
      reviews: [],
    })
    const { ReviewList } = await import('.')
    const wrapper = shallow(<ReviewList />)
    expect(wrapper.find('ReviewCard').length).toBe(0)
    expect(useReviewContextSpy).toHaveBeenCalled()
    expect(wrapper).toMatchSnapshot()
  })

  it('should list of reviews', async () => {
    useReviewContextSpy.mockReturnValue({
      myPendingReviews: mockMyPendingReviews,
      reviews: mockReviews,
    })
    const { ReviewList } = await import('.')
    const wrapper = shallow(<ReviewList />)
    expect(useReviewContextSpy).toHaveBeenCalled()
    expect(wrapper.find('ReviewCard').length).toBeGreaterThan(0)
    expect(wrapper).toMatchSnapshot()
  })
})
