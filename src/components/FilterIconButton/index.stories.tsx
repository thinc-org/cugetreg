import React from 'react'
import { Meta, Story } from '@storybook/react/types-6-0'

import { FilterIconButton } from '.'
import { FilteredTagContext } from '@/context/FilteredTag'
import { FilteredTagProps, DEFAULT_FILTERED_TAG_CONTEXT_VALUE } from '@/context/FilteredTag/constants'

type StoryProps = FilteredTagProps

export default {
  title: 'Component/FilterIconButton',
  component: FilterIconButton,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = () => {
  return (
    <FilteredTagContext.Provider value={DEFAULT_FILTERED_TAG_CONTEXT_VALUE}>
      <FilterIconButton />
    </FilteredTagContext.Provider>
  )
}

Default.args = {}
