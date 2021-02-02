import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'

export const client = new ApolloClient({
  uri: env.backend.uri,
  cache: new InMemoryCache(),
})
