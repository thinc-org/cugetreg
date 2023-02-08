import { ApolloClient, InMemoryCache } from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'

import { ENVIRONMENT } from '@admin-web/env'
import { apiUrl } from '@admin-web/services/httpClient'
// import { uniqBy } from '@admin-web/utils/uniqBy'

import { Course, SearchCourseQueryVariables } from '@cgr/codegen'
import { ADMIN_ACCESS_TOKEN } from '@admin-web/env'

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        search: {
          keyArgs: (args) => {
            let hash = 'Search'
            if (!args) return hash
            const a = args as SearchCourseQueryVariables
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
          // merge(existing: Course[] = [], incoming: Course[]) {
          //   return uniqBy([...existing, ...incoming], (course) => course.courseNo)
          // },
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
  // Todo: Migrate admin access token to somewhere more secure
  // const accessToken = await userStore.getAccessToken()
  // const accessToken = 'wqbglfcqoJx1L3rTOIIx4W31hdHZQN8RV6f9rzW9Jy5eec9TYuR3TQ5e6XVvykt'
  const accessToken = ADMIN_ACCESS_TOKEN
  console.log(`Access token: ${accessToken}`)
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
