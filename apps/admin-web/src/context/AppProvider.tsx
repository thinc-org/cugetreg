import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material'
import { ProtectedRoutes } from './ProtectedRoutes'

import { defaultTheme } from '@admin-web/config/theme'
import { client } from '@admin-web/services/apollo'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <ProtectedRoutes>
        <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
      </ProtectedRoutes>
    </ApolloProvider>
  )
}
