import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { Course } from '@thinc-org/chula-courses'
import { uniqBy } from 'lodash'

import { userStore } from '@/store/userStore'
import env from '@/utils/env/macro'

import { SearchCourseVars } from './query/searchCourse'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: (args) => {
            let hash = 'Search'
            if (!args) return hash
            const a = args as SearchCourseVars
            hash += ':' + a.courseGroup.academicYear
            hash += ':' + a.courseGroup.semester
            hash += ':' + a.courseGroup.studyProgram
            const filter = a.filter
            hash += ':' + (filter.dayOfWeeks ? JSON.stringify(filter.dayOfWeeks) : '')
            hash += ':' + (filter.genEdTypes ? JSON.stringify(filter.genEdTypes) : '')
            hash += ':' + (filter.keyword || '')
            return hash
          },
          read(existing) {
            return existing
          },
          merge(existing: Course[] = [], incoming: Course[]) {
            return uniqBy([...existing, ...incoming], 'courseNo')
          },
        },
      },
    },
  },
})

const httpLink = createHttpLink({
  uri: `${env.backend.uri}/graphql`,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: userStore.accessToken ? `Bearer ${userStore.accessToken}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: cache,
})

export function createApolloServerClient() {
  return new ApolloClient({
    uri: `${env.backend.uri}/graphql`,
    cache: new InMemoryCache(),
  })
}
