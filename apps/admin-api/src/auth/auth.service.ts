import { BadRequestException, Injectable, Logger } from '@nestjs/common'
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
        client_id: this.configService.get<string>('clientId'),
        scope: 'openid email profile',
        redirect_uri: this.configService.get<string>('redirectUrl'),
      },
    }
    const response = await lastValueFrom(
      this.httpService.get(this.configService.get<string>('authorizationUrl'), config)
    )
    return response
  }

  async verify(authenticationCode: string): Promise<any> {
    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      param: {
        code: authenticationCode,
        client_id: this.configService.get<string>('clientId'),
        client_secret: this.configService.get<string>('clientSecret'),
        redirect_uri: this.configService.get<string>('redirectUrl'),
        grant_type: 'authorization_code',
      },
    }
    const response = await lastValueFrom(
      this.httpService.post(this.configService.get<string>('tokenUrl'), config)
    )
    return response.data
  }

  async validateIdToken(idToken: string) {
    // verifyIdToken will throw an error if the token is invalid
    let payload

    if (false) {
      throw new BadRequestException('Invalid id token')
    }

    return payload
  }

  async issueAccessToken(userInfo: any): Promise<string> {
    // NOTE: SIGN WITH USERID?
    const token: AccessTokenPayload = { _id: userInfo.userId.toHexString() }
    this.logger.log('Issued access token', { userId: userInfo.userId })
    return this.jwtService.sign(token)
  }
}
