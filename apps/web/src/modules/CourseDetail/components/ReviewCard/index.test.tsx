import { MdDelete, MdEdit, MdFlag } from 'react-icons/md'

import { ThemeProvider } from '@mui/material'
import { shallow } from 'enzyme'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  mockMyPendingReviews,
  mockMyRejectedReviews,
  mockMyReviews,
  mockReviews,
} from '@web/__mock__/review'
import { lightTheme } from '@web/configs/theme'
import { ReviewCardProps } from '@web/modules/CourseDetail/components/ReviewCard/types'
import { ReviewReaction } from '@web/modules/CourseDetail/components/ReviewReaction'

import { ReviewInteractionType } from '@cgr/codegen'

describe('ReviewCard', () => {
  const mockReviewData = mockReviews[0]
  const mockMyReviewData = mockMyReviews[0]
  const mockMyPendingReviewData = mockMyPendingReviews[0]
  const mockMyRejectedReviewData = mockMyRejectedReviews[0]

  const useThemeSpy = vi.fn(() => lightTheme)
  const setInteractionSpy = vi.fn()
  const reportReviewSpy = vi.fn()
  const deleteMyReviewSpy = vi.fn()
  const editMyReviewSpy = vi.fn()
  const useReviewContextSpy = vi.fn(() => ({
    setInteraction: setInteractionSpy,
    reportReview: reportReviewSpy,
    deleteMyReview: deleteMyReviewSpy,
    editMyReview: editMyReviewSpy,
  }))

  vi.doMock('@web/modules/CourseDetail/context/Review', () => ({
    useReviewContext: useReviewContextSpy,
  }))

  vi.doMock('@mui/material', async () => ({
    ...((await vi.importActual('@mui/material')) as Record<string, unknown>),
    useTheme: useThemeSpy,
  }))

  afterEach(() => {
    vi.clearAllMocks()
  })

  async function customShallow(props: ReviewCardProps) {
    const { ReviewCard } = await import('.')
    return shallow(<ReviewCard {...props} />, {
      wrappingComponent: ThemeProvider,
      wrappingComponentProps: { theme: lightTheme },
    })
  }

  it('should render correctly if this is not your review', async () => {
    const wrapper = await customShallow(mockReviewData)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly if this is your approved review', async () => {
    const wrapper = await customShallow(mockMyReviewData)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly if this is your pending review', async () => {
    const wrapper = await customShallow(mockMyPendingReviewData)
    expect(wrapper).toMatchSnapshot()
  })

  it('should render correctly if this is your rejected review', async () => {
    const wrapper = await customShallow(mockMyRejectedReviewData)
    expect(
      wrapper.text().includes('รีวิวของคุณไม่ได้รับอนุมัติเนื่องจาก มีการพาดพิงถึงบุคคลที่ 42')
    ).toBeTruthy()
    expect(wrapper.text().includes('กรุณาแก้ไข ก่อนส่งรีวิวรายวิชาอีกครั้ง')).toBeTruthy()
    expect(wrapper).toMatchSnapshot()
  })

  it('should not have edit icon and delete icon but report icon if this is not your review', async () => {
    const wrapper = await customShallow(mockReviewData)
    expect(wrapper.find(MdDelete)).toHaveLength(0)
    expect(wrapper.find(MdEdit)).toHaveLength(0)
    // expect(wrapper.find(MdFlag)).toHaveLength(1)
  })

  it('should not have report icon but edit icon and delete icon but have report icon if this is your review', async () => {
    const wrapper = await customShallow(mockMyReviewData)
    expect(wrapper.find(MdDelete)).toHaveLength(1)
    expect(wrapper.find(MdEdit)).toHaveLength(1)
    expect(wrapper.find(MdFlag)).toHaveLength(0)
  })

  it('should not have rejected message if this is not a rejected review', async () => {
    let wrapper = await customShallow(mockReviewData)
    expect(wrapper.text().includes('กรุณาแก้ไข ก่อนส่งรีวิวรายวิชาอีกครั้ง')).toBeFalsy()
    wrapper = await customShallow(mockMyReviewData)
    expect(wrapper.text().includes('กรุณาแก้ไข ก่อนส่งรีวิวรายวิชาอีกครั้ง')).toBeFalsy()
    wrapper = await customShallow(mockMyPendingReviewData)
    expect(wrapper.text().includes('กรุณาแก้ไข ก่อนส่งรีวิวรายวิชาอีกครั้ง')).toBeFalsy()
  })

  it('should call setInteraction with like interaction if we click like', async () => {
    const wrapper = await customShallow(mockReviewData)
    const likeButton = wrapper.find(ReviewReaction).at(0)
    likeButton.simulate('click')
    expect(setInteractionSpy).toHaveBeenCalledTimes(1)
    expect(setInteractionSpy).toHaveBeenCalledWith(mockReviewData._id, ReviewInteractionType.L)
  })

  it('should call setInteraction with dislike interaction if we click dislike', async () => {
    const wrapper = await customShallow(mockReviewData)
    const dislikeButton = wrapper.find(ReviewReaction).at(1)
    dislikeButton.simulate('click')
    expect(setInteractionSpy).toHaveBeenCalledTimes(1)
    expect(setInteractionSpy).toHaveBeenCalledWith(mockReviewData._id, ReviewInteractionType.D)
  })

  it('should call deleteMyReview when click delete icon', async () => {
    const wrapper = await customShallow(mockMyReviewData)
    const deleteIcon = wrapper.find(MdDelete).at(0).parent()
    deleteIcon.simulate('click')
    expect(deleteMyReviewSpy).toHaveBeenCalledTimes(1)
    expect(deleteMyReviewSpy).toHaveBeenCalledWith(mockMyReviewData._id)
  })

  // it('should call reportReview when click report icon', async () => {
  //   const wrapper = await customShallow(mockMyReviewData)
  //   const reportIcon = wrapper.find(MdDelete).at(0).parent()
  //   reportIcon.simulate('click')
  //   expect(deleteMyReviewSpy).toHaveBeenCalledTimes(1)
  //   expect(deleteMyReviewSpy).toHaveBeenCalledWith(mockMyReviewData._id)
  // })

  it('should call editReview when click edit icon', async () => {
    const wrapper = await customShallow(mockMyReviewData)
    const editIcon = wrapper.find(MdEdit).at(0).parent()
    editIcon.simulate('click')
    expect(editMyReviewSpy).toHaveBeenCalledTimes(1)
    expect(editMyReviewSpy).toHaveBeenCalledWith(mockMyReviewData._id)
  })
})
