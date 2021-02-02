import env from '@/utils/env/macro'
import { ApolloClient, gql, InMemoryCache, makeVar } from '@apollo/client'

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
    state: `return_uri=${location.origin}/googleauthcallback`,
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

export interface JwtResponse {
  accessToken: string
  _id: string
  firstName: string
}

export const authData = makeVar<JwtResponse | null>(null)

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

export async function authenticateByCode(client: ApolloClient<Record<string, unknown>>, code: string) {
  const { data, errors } = await client.mutate<JwtResponse>({
    mutation: EXCHANGE_JWT,
    variables: {
      code,
      redirectURI: env.googleauth.redirecturi,
    },
  })

  if (errors) throw errors

  authData(data || null)
}
