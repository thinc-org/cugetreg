import { ApolloProvider } from '@apollo/client'
import { client } from '@admin-web/services/apollo'

interface AppProviderProps {
  children: React.ReactNode
}
export function AppProvider({ children }: AppProviderProps) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
