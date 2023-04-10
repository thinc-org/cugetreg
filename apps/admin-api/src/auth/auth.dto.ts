export type AccessTokenPayload = {
  _id: string
}

export type TokenUrlResponse = {
  data: {
    access_token: string
    id_token: string
  }
}

export type UserInfoDto = {
  email: string
  name: string
  groups: string[]
  exp: string
  iat: string
}
