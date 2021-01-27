import React from 'react'
import Chip from '.'
import { Meta } from '@storybook/react/types-6-0'
import { color, text, withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/Chip/Default',
  decorators: [withKnobs],
} as Meta

export const ChipStory = () => (
  <ThemeProvider theme={lightTheme}>
    <Chip
      textColor={color('textColor', '#2A2D48')}
      backgroundColor={color('backgroundColor', '#E3E5F8')}
      category={text('category', 'เปิดวิชา')}
    />
  </ThemeProvider>
)
