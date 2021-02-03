import React from 'react'
import { DayChip, DayChipProps } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'

export default {
  title: 'Component/Chip/DayChip',
  component: DayChip,
} as Meta

const Template: Story<DayChipProps> = (args) => <DayChip {...args} />

export const Day = Template.bind({})
Day.args = {
  category: 'MO',
}
