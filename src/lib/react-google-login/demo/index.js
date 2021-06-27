import React from 'react'
import { render } from 'react-dom'
import App from './app'

const renderApp = (Component) => {
  const app = document.getElementById('app')

  render(<Component />, app)
}

renderApp(App)

if (module.hot) {
  module.hot.accept('./app.js', () => {
    /* eslint-disable global-require */
    const app = require('./app.js').default
    renderApp(app)
  })
}
