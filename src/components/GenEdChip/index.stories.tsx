import React from 'react'
import GenEdChip from '.'
import { Meta } from '@storybook/react/types-6-0'
import { color, text, withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/Chip/GenEdChip',
  decorators: [withKnobs],
} as Meta

export const GenEdChipStory = () => (
  <ThemeProvider theme={lightTheme}>
    <GenEdChip
      color={color('color', '#EB9C03')}
      category={text('category', 'หมวดวิทย์')}
    />
  </ThemeProvider>
)
