import React from 'react'
import { SearchField, SeachFieldProp } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

type StoryProps = SeachFieldProp

export default {
  title: 'Component/SeachField',
  component: SearchField,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = (args) => {
  return <SearchField {...args} />
}

Default.args = {}
