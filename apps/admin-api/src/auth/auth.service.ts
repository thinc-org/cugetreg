import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { astFromValue } from 'graphql'
import { AccessTokenPayload } from './auth.dto'
import { JwtService } from '@nestjs/jwt'

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

  async requestAuthentik(code: string): Promise<any> {
    const config = {
      params: {
        response_type: code,
        client_id: this.configService.get<string>('CLIENT_ID'),
        scope: 'openid email profile',
        redirect_uri: this.configService.get<string>('REDIRECT_URI'),

      },
    }
    const response = await lastValueFrom(
      this.httpService.get(this.configService.get<string>('AUTHORIZATION_URL'), config)
    )
    return response
  }

  async verify(authenticationCode: string): Promise<any> {
    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      param: {
        code: authenticationCode,
        client_id: this.configService.get<string>('CLIENT_ID'),
        client_secret: this.configService.get<string>('CLIENT_SECRET'),
        redirect_uri: this.configService.get<string>('REDIRECT_URI'),
        grant_type: 'authorization_code',
      },
    }
    const response = await lastValueFrom(
      this.httpService.post('https://auth.internal.cugetreg.com/application/o/token/', config)
    )
    return response.data
  }

  async issueAccessToken(userInfo: any): Promise<string> {
    // NOTE: SIGN WITH USERID?
    const token: AccessTokenPayload = { _id: userInfo.userId.toHexString() }
    this.logger.log('Issued access token', { userId: userInfo.userId })
    return this.jwtService.sign(token)
  }
}
