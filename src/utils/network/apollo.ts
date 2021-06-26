import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'
import { Course } from '@thinc-org/chula-courses'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: false,
          read(existing) {
            return existing
          },
          merge(existing: Course[] = [], incoming: Course[]) {
            return [...existing, ...incoming]
          },
        },
      },
    },
  },
})

export const client = new ApolloClient({
  uri: env.backend.uri,
  cache: cache,
})
