import { HttpService } from '@nestjs/axios'
import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import axios, { AxiosRequestConfig } from 'axios'
import { lastValueFrom, map } from 'rxjs'

import { AccessTokenPayload, TokenUrlResponse, UserInfoDto } from './auth.dto'

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
    }

    const reqBody = {
      code: authenticationCode,
      client_id: this.configService.get<string>('clientId'),
      client_secret: this.configService.get<string>('clientSecret'),
      redirect_uri: this.configService.get<string>('redirectUrl'),
      grant_type: 'authorization_code',
    }

    try {
      const response = (await axios.post(
        this.configService.get<string>('tokenUrl'),
        new URLSearchParams(reqBody),
        config
      )) as TokenUrlResponse

      console.log(response.data)

      return {
        id_token: response.data?.id_token,
        access_token: response.data?.access_token,
      }
    } catch (err) {
      // TODO: Add better error handler
      // console.log(err)
      return {}
    }
  }

  async validateIdToken(idToken: string) {
    try {
      const userInfo = this.jwtService.decode(idToken) as UserInfoDto

      // TODO: Check if user is in cugetreg group
      const payload = {
        email: userInfo.email,
        name: userInfo.name,
        groups: userInfo.groups,
      } as UserInfoDto

      console.log(userInfo)
      return payload
    } catch (e) {
      throw new BadRequestException('Invalid id token')
    }
  }

  // TODO: lessen expiry time?
  async issueAccessToken(userInfo: UserInfoDto): Promise<string> {
    this.logger.log(`Issued access token for: ${userInfo.name}`)
    return this.jwtService.sign(userInfo)
  }
}
