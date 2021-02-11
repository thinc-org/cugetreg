import React from 'react'
import { AnnouncementSearch, AnnouncementSearchProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ALL_FACULTIES, ALL_CATEGORIES } from '@/utils/const'

export default {
  title: 'Component/AnnouncementSearch',
  component: AnnouncementSearch,
} as Meta

export const AnnouncementSearchStory: Story<AnnouncementSearchProps> = (args) => {
  return <AnnouncementSearch {...args} />
}

AnnouncementSearchStory.args = {
  categories: [ALL_CATEGORIES, 'HU'],
  faculties: [ALL_FACULTIES, 'key1'],
}
