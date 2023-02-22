import { mockMyPendingReviews, mockReviews } from '@web/__mock__/review'
import { shallow } from 'enzyme'

describe('ReviewList', () => {
  const useReviewContextSpy = jest.fn()

  jest.doMock('@web/modules/CourseDetail/context/Review', () => ({
    useReviewContext: useReviewContextSpy,
  }))

  jest.doMock('@web/modules/CourseDetail/components/ReviewCard', () => ({
    ReviewCard: () => <>ReviewCard</>,
  }))

  beforeEach(() => {
    jest.resetAllMocks()
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
