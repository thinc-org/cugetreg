import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'
import { authDataFieldPolicy } from './googleauth'

export const client = new ApolloClient({
  uri: env.backend.uri,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          ...authDataFieldPolicy,
        },
      },
    },
  }),
})
