import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { TagList, TagListProps } from '.'

type StoryProps = TagListProps

export default {
  title: 'Component/TagList',
  component: TagList,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = () => {
  return <TagList />
}

Default.args = {
  tags: ['MO', 'IN', 'SC'],
}
