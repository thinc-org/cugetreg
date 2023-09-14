import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import axios, { AxiosRequestConfig } from 'axios'

import { TokenUrlResponse, UserInfoDto } from './auth.dto'

@Injectable()
export class AuthService {
  logger: Logger

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.logger = new Logger('Auth Service')
  }

  async verifyAuthenticationCode(authenticationCode: string) {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }

    const reqBody = new URLSearchParams({
      code: authenticationCode,
      client_id: this.configService.get<string>('clientId'),
      client_secret: this.configService.get<string>('clientSecret'),
      redirect_uri: this.configService.get<string>('redirectUrl'),
      grant_type: 'authorization_code',
    })

    try {
      const response = (await axios.post(
        this.configService.get<string>('tokenUrl'),
        reqBody.toString(),
        config
      )) as TokenUrlResponse

      return {
        id_token: response.data?.id_token,
        access_token: response.data?.access_token,
      }
    } catch (err) {
      return null
    }
  }

  async validateIdToken(idToken: string) {
    try {
      const userInfo = this.jwtService.decode(idToken) as UserInfoDto

      if (!userInfo || !userInfo.groups) throw new Error("User is null or User doesn't have groups")

      // TODO: Check if user is in cugetreg group
      const payload = {
        email: userInfo.email,
        name: userInfo.name,
        groups: userInfo.groups,
      } as UserInfoDto

      return payload
    } catch (e) {
      return null
    }
  }

  async issueAccessToken(userInfo: UserInfoDto): Promise<string> {
    this.logger.log(`Issued access token for: ${userInfo.name}`)
    return this.jwtService.sign(userInfo)
  }
}
