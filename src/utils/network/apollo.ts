import { ApolloClient, InMemoryCache } from '@apollo/client'

import env from '@/utils/env/macro'
import { Course } from '@thinc-org/chula-courses'
import { SearchCourseVars } from '@/utils/network/BackendGQLQueries'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: false,
          read(existing) {
            return existing
          },
          merge(existing: Course[] = [], incoming: Course[], { args }) {
            const offset = args?.filter.offset as SearchCourseVars
            if (!offset) return [...incoming]
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
