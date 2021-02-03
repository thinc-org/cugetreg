import env from '@/utils/env/macro'
import { ApolloClient, gql, makeVar } from '@apollo/client'

/**
 * Auth flow
 *
 *    Client/Frontend     Backend     Google
 *       r------------------------------->
 *                          <------------r redirect to redirect_uri which just act as a code redirector
 *       <------------------r              code got redirected to state.return_uri
 *       o<---------------->o              GraphQL verify
 *
 *   r--> is client redirect
 *   o<->o is graphql query
 */

export function createRedirectUrl() {
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

const EXCHANGE_JWT = gql`
  mutation ExchangeJwtToken($code: String!, $redirectURI: String!) {
    verify(code: $code, redirectURI: $redirectURI) {
      accessToken
      _id
      firstName
    }
  }
`

interface ExchangeJwtResponse {
  verify: AuthData
}

interface AuthData {
  accessToken: string
  _id: string
  firstName: string
}

export interface GetAuthData {
  authData: AuthData
}

const AUTHDATA_LOCALSTORAGE_FIELD = 'authdata'

function getAuthDataFromLocalStorage(): AuthData | null {
  if (typeof localStorage == 'undefined') return null
  const local = localStorage.getItem(AUTHDATA_LOCALSTORAGE_FIELD)
  if (!local) return null

  return JSON.parse(local)
}

export const authData = makeVar<AuthData | null>(getAuthDataFromLocalStorage())

export const GET_AUTH_DATA = gql`
  query GetAuthData {
    authData @client
  }
`

export const authDataFieldPolicy = {
  authData: {
    read() {
      return authData()
    },
  },
}

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

export function logout() {
  localStorage.removeItem(AUTHDATA_LOCALSTORAGE_FIELD)
  authData(null)
}
