import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'

import { ENVIRONMENT, ADMIN_ACCESS_TOKEN } from '@admin-web/env'
import { apiUrl } from '@admin-web/services/httpClient'

const createHttpLink = () =>
  new BatchHttpLink({
    uri: `${apiUrl}/graphql`,
  })

const authLink = setContext(async (_, { headers }) => {
  const accessToken = ADMIN_ACCESS_TOKEN
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(createHttpLink()),
  cache: new InMemoryCache(),
  connectToDevTools: ENVIRONMENT !== 'production',
})

export function createApolloServerClient() {
  return new ApolloClient({
    link: createHttpLink(),
    cache: new InMemoryCache(),
    connectToDevTools: ENVIRONMENT !== 'production',
  })
}