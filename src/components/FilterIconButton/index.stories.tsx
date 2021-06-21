import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'

import { FilterIconButton } from '.'
import { CourseSearchContext } from '@/context/CourseSearch'
import { CourseSearchProps, DEFAULT_COURSE_SEARCH_CONTEXT_VALUE } from '@/context/CourseSearch/constants'

type StoryProps = CourseSearchProps

export default {
  title: 'Component/FilterIconButton',
  component: FilterIconButton,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = () => {
  return (
    <CourseSearchContext.Provider value={DEFAULT_COURSE_SEARCH_CONTEXT_VALUE}>
      <FilterIconButton />
    </CourseSearchContext.Provider>
  )
}

Default.args = {}
