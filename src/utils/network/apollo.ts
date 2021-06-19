import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'
import { authDataFieldPolicy } from './auth'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        ...authDataFieldPolicy,
      },
    },
  },
})

export const client = new ApolloClient({
  uri: env.backend.uri,
  cache: cache,
})
