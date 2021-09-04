import { Meta, Story } from '@storybook/react/types-6-0'
import React from 'react'

import { FilterIconButton, FilterIconButtonProps } from '.'

type StoryProps = FilterIconButtonProps

export default {
  title: 'Component/FilterIconButton',
  component: FilterIconButton,
} as Meta<StoryProps>

export const Default: Story<StoryProps> = () => {
  return <FilterIconButton onClick={() => 0} />
}

Default.args = {}
