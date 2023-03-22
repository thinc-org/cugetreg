import { defaultTheme } from '@admin-web/config/theme'
import { client } from '@admin-web/services/apollo'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
    </ApolloProvider>
  )
}
