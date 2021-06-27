import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean, select } from '@storybook/addon-knobs'
import { withTests } from '@storybook/addon-jest'

import GoogleLogin from '../src/google-login'
import results from '../.jest-test-results.json'
import markdownNotes from './google-login-notes.md'

const clientId = '617246850621-95f9qhmehd380g2df86pjhrqc84n8nij.apps.googleusercontent.com'

const options = {
  None: null,
  Blue: 'dark',
}

// GOOGLE LOGIN BUTTON MODULE
const story = storiesOf('Google Login Button', module)

// KNOBS
story.addDecorator(withKnobs)

// JEST TEST
story.addDecorator(withTests({ results }))

// MAIN BUTTON W/ ACTION LOGGER
story.add(
  'Default Button',
  () => (
    <GoogleLogin
      theme={select('Theme', options)}
      clientId={clientId}
      disabled={boolean('Disabled', false)}
      onAutoLoadFinished={action('autoLoadFinished')}
      onSuccess={action('clicked')}
      onFailure={action('clicked')}
    >
      {text('Button Text', '')}
    </GoogleLogin>
  ),
  {
    jest: ['google-login.test.js'],
    notes: { markdown: markdownNotes },
  }
)
