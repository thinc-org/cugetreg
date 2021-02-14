import { Meta, Story } from '@storybook/react/types-6-0'
import CustomChip, { CustomChipProps } from '.'
import { ChipConfig } from './config'

export default {
  title: 'Component/Chips',
  component: CustomChip,
  argTypes: {
    type: {
      defaultValue: 'SO',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(ChipConfig),
      },
    },
    size: {
      defaultValue: 'medium',
      description: "Chip's size",
      control: {
        type: 'select',
        options: ['medium', 'small'],
      },
    },
  },
} as Meta<CustomChipProps>

const Template: Story<CustomChipProps> = (args) => {
  return <CustomChip {...args} />
}

export const Default = Template.bind({})
Default.args = {}

export const Deleteable = Template.bind({})
Deleteable.args = {
  onDelete: () => ({}),
}
