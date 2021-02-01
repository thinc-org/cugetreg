import React from 'react'
import GenEdChip, { GenedChipPropsType } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/Chip/GenEdChip',
  component: GenEdChip,
} as Meta

const GenEdChipStory: Story<GenedChipPropsType> = (args) => (
  <ThemeProvider theme={lightTheme}>
    <GenEdChip {...args} />
  </ThemeProvider>
)

export const Template = GenEdChipStory.bind({})
Template.args = {
  size: 'large',
  category: 'HU',
}
