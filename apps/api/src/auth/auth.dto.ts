export class AccessTokenPayload {
  _id: string
}

export interface OauthStatePayload {
  returnUrl: string
  overrideBackendUrl?: string
}
