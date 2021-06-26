import env from '@/utils/env/macro'
import { FetchPolicy, gql } from '@apollo/client'
import { client } from './apollo'
import { AuthData, MeData } from '@/store/meStore'

/**
 * Auth flow
 *
 *    Client/Frontend     Backend     Google
 *       r-------------------------------> redirect to createRedirectionUrl() (1)
 *       <-------------------------------r code got redirected to return_uri (2)
 *       o<---------------->o              GraphQL verify using authenticateByCode (3)
 *
 *   r--> is client redirect
 *   o<->o is graphql query
 *
 *  In case that the redirect_uri is unstable (for Render PR). use redirect redirector in the backend at $backend/auth/callback
 *  during step (1) and attach the final redirection target as state.returnURI.
 */

const getCallbackUrl = () => `${location.origin}/googleauthcallback`

/**
 * Create redirection url for redirecting to Google
 * that will return the result to this client's origin.
 */
export function getRedirectUrl() {
  const clientId = env.googleauth.clientid
  const callbackUrl = getCallbackUrl()
  const currentPath = location.href

  if (typeof clientId !== 'string')
    throw new Error(
      "GoogleAuth client id environment is not a string (because it's not set?). Failed to generate redirect URL"
    )

  const queries = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    scope: 'openid profile email https://www.googleapis.com/auth/drive.appdata',
    access_type: 'offline',
    include_granted_scopes: 'true',
    hd: 'student.chula.ac.th',
    prompt: 'consent',
  })

  // use redirect redirector
  /*
  const codeRedirector = env.googleauth.coderedirector
  if (typeof codeRedirector !== 'string')
    throw new Error("Auth CodeRedirector environment URL is not a string (because it's not set?). RenderPR requires it")
  queries.set('redirect_uri', codeRedirector)
  queries.set('state', `returnURI=${callbackUrl}`)
  */

  queries.set('redirect_uri', callbackUrl)
  queries.set('state', encodeURI(currentPath))

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
 * Exchange Google OAuth code for JWT token and store it.
 *
 * @param client
 * @param code
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function retrieveAuthDataUsingCode(code: string): Promise<AuthData> {
  const { data, errors } = await client.mutate<ExchangeJwtResponse>({
    mutation: EXCHANGE_JWT,
    variables: {
      code,
      redirectURI: getCallbackUrl(),
    },
  })

  if (errors) throw errors
  if (!data) throw new Error('No data returned from verify endpoint')

  return data.verify
}

/** Query for retrieving MeData */
export const GET_ME = gql`
  query GetMe {
    me {
      _id
      email
      firstName
      lastName
      google {
        accessToken
        expiresIn
      }
    }
  }
`

export async function retrieveMeData(authData: AuthData): Promise<MeData> {
  const me = await client.query<{ me: MeData }>({
    query: GET_ME,
    context: {
      headers: {
        Authorization: `Bearer ${authData.accessToken}`,
      },
    },
    fetchPolicy: 'no-cache',
  })
  return me.data.me
}
