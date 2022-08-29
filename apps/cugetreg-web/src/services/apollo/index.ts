import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'
import { Course } from '@thinc-org/chula-courses'

import { ENVIRONMENT } from '@web/env'
import { apiUrl } from '@web/services/httpClient'
import { userStore } from '@web/store/userStore'
import { uniqBy } from '@web/utils/uniqBy'

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
            hash += ':' + (filter.periodRange ? JSON.stringify(filter.periodRange) : '')
            hash += ':' + (filter.keyword || '')
            return hash
          },
          read(existing) {
            return existing
          },
          merge(existing: Course[] = [], incoming: Course[]) {
            return uniqBy([...existing, ...incoming], (course) => course.courseNo)
          },
        },
      },
    },
  },
})

const createHttpLink = () =>
  new BatchHttpLink({
    uri: `${apiUrl}/graphql`,
  })

const authLink = setContext(async (_, { headers }) => {
  const accessToken = await userStore.getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(createHttpLink()),
  cache: cache,
  connectToDevTools: ENVIRONMENT !== 'production',
})

export function createApolloServerClient() {
  return new ApolloClient({
    link: createHttpLink(),
    cache: new InMemoryCache(),
    connectToDevTools: ENVIRONMENT !== 'production',
  })
}
