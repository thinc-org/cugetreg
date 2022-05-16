import {
  ApolloClient,
  ApolloLink,
  FieldPolicy,
  InMemoryCache,
  NormalizedCacheObject,
  FieldReadFunction,
} from '@apollo/client'
import { BatchHttpLink } from '@apollo/client/link/batch-http'
import { setContext } from '@apollo/client/link/context'
import { Course } from '@thinc-org/chula-courses'
import merge from 'deepmerge'
import { isEqual } from 'lodash-es'

import { useMemo } from 'react'

import { CMS_URL, ENVIRONMENT } from '@/env'
import { apiUrl } from '@/services/httpClient'
import { userStore } from '@/store/userStore'
import { uniqBy } from '@/utils/uniqBy'

import { SearchCourseVars } from './query/searchCourse'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined

const fieldPolicy: Record<string, FieldPolicy | FieldReadFunction> = {
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
    read(existing: Course[]) {
      return existing
    },
    merge(existing: Course[] = [], incoming: Course[]) {
      return uniqBy([...existing, ...incoming], (course) => course.courseNo)
    },
  },
}

const backendLink = new BatchHttpLink({
  uri: `${apiUrl}/graphql`,
})

const cmsLink = new BatchHttpLink({
  uri: `${CMS_URL}/graphql`,
})

const authLink = setContext(async (_, { headers }) => {
  if (typeof window === 'undefined') return {}
  const accessToken = await userStore.getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
    },
  }
})

const switchEndpointLink = ApolloLink.split(
  (operation) => {
    return operation.getContext().cms === true
  },
  cmsLink,
  backendLink
)

export function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: ApolloLink.from([authLink, switchEndpointLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: fieldPolicy,
        },
      },
    }),
    connectToDevTools: ENVIRONMENT !== 'production',
  })
}

export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) => sourceArray.every((s) => !isEqual(d, s))),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export function addApolloState(client: ApolloClient<NormalizedCacheObject>, pageProps: any) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}
