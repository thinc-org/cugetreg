import { ApolloProvider } from '@apollo/client'
import { client } from '@admin-web/services/apollo'
import Topbar from '@admin-web/common/Topbar/Topbar'

interface AppProviderProps {
  children: React.ReactNode
}
export function AppProvider({ children }: AppProviderProps) {
  return (
    <ApolloProvider client={client}>
      <Topbar />
      {children}
    </ApolloProvider>
  )
}
