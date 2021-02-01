import React from 'react'
import { GenEdChip, GenedChipPropsType } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/Chip/GenEdChip',
  component: GenEdChip,
} as Meta

const Template: Story<GenedChipPropsType> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <GenEdChip {...args} />
  </ThemeProvider>
)

export const GenEd = Template.bind({})
GenEd.args = {
  category: 'HU',
}

export const NoGeneed = Template.bind({})
NoGeneed.args = {}
