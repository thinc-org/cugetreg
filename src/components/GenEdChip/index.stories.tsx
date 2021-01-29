import React from 'react'
import GenEdChip from '.'
import { Meta } from '@storybook/react/types-6-0'
import { select, withKnobs } from '@storybook/addon-knobs'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'
import { GenEd } from '@/utils/types'

export default {
  title: 'Component/Chip/GenEdChip',
  decorators: [withKnobs],
} as Meta

export const GenEdChipStory = () => (
  <ThemeProvider theme={lightTheme}>
    <GenEdChip category={select('category', Object.values(GenEd), GenEd.HU, GenEd.HU)} />
  </ThemeProvider>
)
