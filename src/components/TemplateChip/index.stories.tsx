import React from 'react'
import Chip from '.'
import { Meta } from '@storybook/react/types-6-0'
import { color, text, withKnobs } from '@storybook/addon-knobs'

export default {
  title: 'Component/Chip/TemplateChip',
  decorators: [withKnobs],
} as Meta

export const ChipStory = () => (
  <Chip
    textColor={color('textColor', '#2A2D48')}
    backgroundColor={color('backgroundColor', '#E3E5F8')}
    category={text('category', 'เปิดวิชา')}
  />
)
