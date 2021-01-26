import React from 'react'
import AnnouncementCard, { PropTypes } from '.'
import { Meta, Story } from '@storybook/react/types-6-0'
import { array, text, withKnobs } from '@storybook/addon-knobs'
import { date } from '@storybook/addon-knobs'

export default {
  title: 'Component/AnnouncementCard',
  decorators: [withKnobs],
} as Meta

export const Tempalte = () => (
  <AnnouncementCard
    date={new Date(date('date', new Date()))}
    imageURL={text('imageURL', 'https://libreshot.com/wp-content/uploads/2018/10/thermo-camera.jpg')}
    title={text('title', 'test')}
    tags={array('tags', ['test1', 'test2'])}
    body={text('body', 'lorem yipsum')}
  />
)
