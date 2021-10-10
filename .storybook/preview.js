import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@material-ui/core'
import { lightTheme } from '../src/configs/theme'

import { withNextRouter } from 'storybook-addon-next-router'
import AdapterDateFns from '@material-ui/lab/AdapterDateFns'
import LocalizationProvider from '@material-ui/lab/LocalizationProvider'
import { ApolloProvider } from '@apollo/client'
import { client } from '../src/services/apollo'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

const themeDecorator = (Story) => (
  <StyledEngineProvider injectFirst>
    <ApolloProvider client={client}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </LocalizationProvider>
    </ApolloProvider>
  </StyledEngineProvider>
)

export const decorators = [withNextRouter(), themeDecorator]
