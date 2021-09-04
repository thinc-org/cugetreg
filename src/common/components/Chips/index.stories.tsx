import { Avatar, Box } from '@material-ui/core'
import { Meta, Story } from '@storybook/react/types-6-0'

import { GeneralChip, GeneralChipProps } from '.'
import { AnnoucementChip } from './catagories/AnnoucementChip'
import { DayChip } from './catagories/DayChip'
import { GenEdChip } from './catagories/GenEdChip'
import {
  chipConfig,
  GeneralChipKey,
  dayChipConfig,
  DayChipKey,
  genEdChipConfig,
  GenEdChipKey,
  otherChipConfig,
  OtherChipKey,
} from './config'

type AllProps = Omit<GeneralChipProps, 'type'> & {
  generalChip: GeneralChipKey
  genEdChip: GenEdChipKey
  dayChip: DayChipKey
  annoucementChip: GenEdChipKey | OtherChipKey
}

export default {
  title: 'Component/Chips',
  component: GeneralChip,
  argTypes: {
    generalChip: {
      defaultValue: 'other',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(chipConfig),
      },
    },
    genEdChip: {
      defaultValue: 'HU',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(genEdChipConfig),
      },
    },
    dayChip: {
      defaultValue: 'TU',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(dayChipConfig),
      },
    },
    annoucementChip: {
      defaultValue: 'chula',
      description: 'Use to style chip from keyword from `ChipKey`. No need to style by yourselves',
      control: {
        type: 'select',
        options: Object.keys(otherChipConfig).concat(Object.keys(genEdChipConfig)),
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
  const { avatar, onDelete, genEdChip, dayChip, annoucementChip, generalChip, ...rest } = args
  const mockFunction = () => console.log('Mock Function')
  return (
    <Box display="flex">
      <Box mr={2}>
        <GeneralChip
          type={generalChip}
          avatar={avatar ? <Avatar>{generalChip.slice(0, 2).toUpperCase()}</Avatar> : undefined}
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
