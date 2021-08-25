import { ApolloClient, InMemoryCache } from '@apollo/client'
import { Course } from '@thinc-org/chula-courses'
import { uniqBy } from 'lodash'

import env from '@/env/macro'

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

export const client = new ApolloClient({
  uri: `${env.backend.uri}/graphql`,
  cache: cache,
})

export function createApolloServerClient() {
  return new ApolloClient({
    uri: `${env.backend.uri}/graphql`,
    cache: new InMemoryCache(),
  })
}
