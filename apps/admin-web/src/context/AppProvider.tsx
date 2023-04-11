import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material'

import { Layout } from '@admin-web/common/Layout'
import { defaultTheme } from '@admin-web/config/theme'
import { client } from '@admin-web/services/apollo'

import AuthProvider from './AuthProvider'
import { ProtectedRoutes } from './ProtectedRoutes'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <ThemeProvider theme={defaultTheme}>
          <Layout>
            <ProtectedRoutes>{children}</ProtectedRoutes>
          </Layout>
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}
