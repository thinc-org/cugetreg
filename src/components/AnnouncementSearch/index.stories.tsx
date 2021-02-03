import React from 'react'
import { AnnouncementSearch, AnnouncementSearchProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

export default {
  title: 'Component/AnnouncementSearch',
  component: AnnouncementSearch,
} as Meta

export const AnnouncementSearchStory: Story<AnnouncementSearchProps> = (args) => {
  return <AnnouncementSearch {...args} />
}

AnnouncementSearchStory.args = {
  categories: ['ทุกหมวดหมู่', 'test2'],
  faculties: ['ทุกคณะ', 'test11'],
}
