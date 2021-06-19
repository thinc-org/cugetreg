import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'

const cache = new InMemoryCache({})

export const client = new ApolloClient({
  uri: env.backend.uri,
  cache: cache,
})
