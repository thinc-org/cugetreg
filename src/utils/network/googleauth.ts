import env from '@/utils/env/macro'
import { ApolloClient, gql, makeVar } from '@apollo/client'

/**
 * Auth flow
 *
 *    Client/Frontend     Backend     Google
 *       r-------------------------------> redirect to createRedirectionUrl() (Phase 1)
 *                          <------------r redirect to redirect_uri which just act as a code redirector
 *       <------------------r              code got redirected to state.return_uri
 *       o<---------------->o              GraphQL verify using authenticateByCode (Phase 2)
 *
 *   r--> is client redirect
 *   o<->o is graphql query
 */

/**
 * Create redirection url for redirecting to Google
 * that will return the result to this client's origin.
 */
export function getRedirectUrl() {
  const queries = new URLSearchParams({
    client_id: env.googleauth.clientid,
    redirect_uri: env.googleauth.redirecturi,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    access_type: 'online',
    include_granted_scopes: 'true',
    state: `returnURI=${location.origin}/googleauthcallback`,
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${queries.toString()}`
}

/**
 * Query for exchanging Google OAuth code to JWT
 *
 * @see authenticateByCode
 */
const EXCHANGE_JWT = gql`
  mutation ExchangeJwtToken($code: String!, $redirectURI: String!) {
    verify(code: $code, redirectURI: $redirectURI) {
      accessToken
      _id
      firstName
    }
  }
`

/**
 * JWT Response from backend using EXCHANGE_JWT query
 */
interface ExchangeJwtResponse {
  verify: AuthData
}

/**
 * User's authorization data for authenticating with the backend
 */
interface AuthData {
  accessToken: string
  _id: string
  firstName: string
}

/**
 * Exchange Google OAuth code for JWT token and store it.
 *
 * @param client
 * @param code
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function authenticateByCode(client: ApolloClient<object>, code: string) {
  const { data, errors } = await client.mutate<ExchangeJwtResponse>({
    mutation: EXCHANGE_JWT,
    variables: {
      code,
      redirectURI: env.googleauth.redirecturi,
    },
  })

  if (errors) throw errors
  if (!data?.verify) throw new Error('No verify result')

  localStorage.setItem(AUTHDATA_LOCALSTORAGE_FIELD, JSON.stringify(data.verify))
  authData(data.verify)
}

/**
 * User auth data when requested from Apollo
 * @see GET_AUTH_DATA
 */
export interface GetAuthData {
  authData: AuthData
}

/**
 * Query to request user's auth data return {@link GetAuthData}
 */
export const GET_AUTH_DATA = gql`
  query GetAuthData {
    authData @client
  }
`

/**
 * Logging the user out
 */
export function logout() {
  localStorage.removeItem(AUTHDATA_LOCALSTORAGE_FIELD)
  authData(null)
}

// Apollo local state and caching ===============

const AUTHDATA_LOCALSTORAGE_FIELD = 'authdata'

function getAuthDataFromLocalStorage(): AuthData | null {
  if (typeof localStorage == 'undefined') return null
  const local = localStorage.getItem(AUTHDATA_LOCALSTORAGE_FIELD)
  if (!local) return null

  return JSON.parse(local)
}

export const authData = makeVar<AuthData | null>(getAuthDataFromLocalStorage())

export const authDataFieldPolicy = {
  authData: {
    read() {
      return authData()
    },
  },
}
