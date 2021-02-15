import { Avatar, Box } from '@material-ui/core'
import { Meta, Story } from '@storybook/react/types-6-0'
import CustomChip, { CustomChipProps } from '.'
import AnnoucementChip from './catagories/AnnoucementChip'
import DayChip from './catagories/DayChip'
import GenEdChip from './catagories/GenEdChip'
import {
  ChipConfig,
  DayChipConfig,
  DayChipKey,
  GenEdChipConfig,
  GenEdChipKey,
  OtherChipConfig,
  OtherChipKey,
} from './config'

type AllProps = CustomChipProps & {
  genEdChip: GenEdChipKey
  dayChip: DayChipKey
  annoucementChip: GenEdChipKey | OtherChipKey
}

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
    genEdChip: {
      defaultValue: 'SC',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(GenEdChipConfig),
      },
    },
    dayChip: {
      defaultValue: 'MO',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(DayChipConfig),
      },
    },
    annoucementChip: {
      defaultValue: 'chula',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(OtherChipConfig).concat(Object.keys(GenEdChipConfig)),
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
} as Meta<AllProps>

const Template: Story<AllProps> = (args) => {
  const { avatar, onDelete, genEdChip, dayChip, annoucementChip, type, ...rest } = args
  const mockFunction = () => console.log('Mock Function')
  return (
    <Box display="flex">
      <Box mr={2}>
        <CustomChip
          type={type}
          avatar={avatar ? <Avatar>{args.type.slice(0, 2).toUpperCase()}</Avatar> : undefined}
          onDelete={onDelete ? mockFunction : undefined}
          {...rest}
        />
      </Box>
      <Box mr={2}>
        <GenEdChip
          type={genEdChip}
          avatar={avatar ? <Avatar>{genEdChip.slice(0, 2).toUpperCase()}</Avatar> : undefined}
          onDelete={onDelete ? mockFunction : undefined}
          {...rest}
        />
      </Box>
      <Box mr={2}>
        <DayChip
          type={dayChip}
          avatar={avatar ? <Avatar>{dayChip.slice(0, 2).toUpperCase()}</Avatar> : undefined}
          onDelete={onDelete ? mockFunction : undefined}
          {...rest}
        />
      </Box>
      <Box mr={2}>
        <AnnoucementChip
          type={annoucementChip}
          avatar={avatar ? <Avatar>{annoucementChip.slice(0, 2).toUpperCase()}</Avatar> : undefined}
          onDelete={onDelete ? mockFunction : undefined}
          {...rest}
        />
      </Box>
    </Box>
  )
}

export const Default = Template.bind({})
Default.args = {
  onDelete: undefined,
}
