import { Avatar } from '@material-ui/core'
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
        type: 'radio',
        options: ['medium', 'small'],
      },
    },
    clickable: {
      description: "Chip's cliakble state",
      control: {
        type: 'boolean',
      },
    },
    onDelete: {
      description: "Chip's onDelete action",
      control: {
        type: 'boolean',
      },
    },
    avatar: {
      description: "Chip's avatar display",
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta<CustomChipProps>

const Template: Story<CustomChipProps> = (args) => {
  const { avatar, onDelete, ...rest } = args
  const mockFunction = () => console.log('Mock Function')
  return (
    <CustomChip
      avatar={avatar ? <Avatar>{args.type.slice(0, 2).toUpperCase()}</Avatar> : undefined}
      onDelete={onDelete ? mockFunction : undefined}
      {...rest}
    />
  )
}

export const Default = Template.bind({})
Default.args = {
  onDelete: undefined,
}
