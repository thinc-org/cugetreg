import React from 'react'
import { Meta } from '@storybook/react/types-6-0'
import { Schedule } from '.'

export default {
  title: 'Component/Schedule',
  component: Schedule,
} as Meta

export const ScheduleStory = () => {
  return <Schedule />
}
