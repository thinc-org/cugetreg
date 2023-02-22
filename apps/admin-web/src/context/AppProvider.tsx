import Topbar from '@admin-web/common/Topbar/Topbar'
import { defaultTheme } from '@admin-web/config/theme/index'
import { client } from '@admin-web/services/apollo'
import { ApolloProvider } from '@apollo/client'
import { ThemeProvider } from '@mui/material'

interface AppProviderProps {
  children: React.ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultTheme}>
        <Topbar />
        {children}
      </ThemeProvider>
    </ApolloProvider>
  )
}
