import { ApolloProvider } from '@apollo/client'
import { client } from '@admin-web/services/apollo'
import { ThemeProvider } from '@mui/material'
import { defaultTheme } from '@admin-web/config/theme/index'
import Topbar from '@admin-web/common/Topbar/Topbar'

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
