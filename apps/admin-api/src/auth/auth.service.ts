import { HttpService } from '@nestjs/axios'
import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { AxiosRequestConfig } from 'axios'
import { lastValueFrom } from 'rxjs'

import { AccessTokenPayload } from './auth.dto'

@Injectable()
export class AuthService {
  logger: Logger

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private jwtService: JwtService
  ) {
    this.logger = new Logger('Auth Service')
  }

  // async requestAuthentik(code: string): Promise<any> {
  //   const config = {
  //     params: {
  //       response_type: code,
  //       client_id: this.configService.get<string>('clientId'),
  //       scope: 'openid email profile',
  //       redirect_uri: this.configService.get<string>('redirectUrl'),
  //     },
  //   }
  //   const response = await lastValueFrom(
  //     this.httpService.get(this.configService.get<string>('authorizationUrl'), config)
  //   )
  //   return response
  // }

  async verifyAuthenticationCode(authenticationCode: string) {
    const config: AxiosRequestConfig = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      params: {
        code: authenticationCode,
        client_id: this.configService.get<string>('clientId'),
        client_secret: this.configService.get<string>('clientSecret'),
        redirect_uri: this.configService.get<string>('redirectUrl'),
        grant_type: 'authorization_code',
      },
    }

    console.log('Authenticating code')

    const response = await lastValueFrom(
      this.httpService.post(this.configService.get<string>('tokenUrl'), config)
    )

    this.logger.log('Response: ', response)

    return response.data
  }

  async validateIdToken(idToken: string) {
    let payload: {
      email: string
      name: string
      roles: string
    }

    try {
      const userInfo = JSON.parse(this.jwtService.decode(idToken) as string)
      payload.email = userInfo.email
      payload.name = userInfo.name
      payload.roles = userInfo.roles
    } catch (e) {
      throw new BadRequestException('Invalid id token')
    }

    return payload
  }

  async issueAccessToken(userInfo): Promise<string> {
    const token: AccessTokenPayload = { _id: userInfo.userId.toHexString() }
    this.logger.log('Issued access token', { userId: userInfo.userId })
    return this.jwtService.sign(token)
  }
}
