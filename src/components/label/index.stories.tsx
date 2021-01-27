import React from 'react'
import Label from '.'
import { Meta } from '@storybook/react/types-6-0'
import { color, text, withKnobs } from '@storybook/addon-knobs'

export default {
  title: 'Component/Label',
  decorators: [withKnobs],
} as Meta

export const LabelStory = () => (
  <Label
    textColor={color('textColor', '#EB9C03')}
    borderColor={color('borderColor', '#EB9C03')}
    backgroundColor={color('backgroundColor', '#FFFFF')}
    category={text('category', 'test')}
  />
)
