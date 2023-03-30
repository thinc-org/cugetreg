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
        client_id: '2f3a5527c10a61c0489d75825011c69f59743981',
        scope: 'openid email profile',
        redirect_uri: 'localhost:4201',
      },
    }
    const response = await lastValueFrom(
      this.httpService.get('https://auth.internal.cugetreg.com/application/o/authorize/', config)
    )
    return response
  }

  async verify(authenticationCode: string): Promise<any> {
    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      param: {
        code: authenticationCode,
        client_id: '2f3a5527c10a61c0489d75825011c69f59743981',
        client_secret:
          '5fcb850b2b50fff7d1c135a9fc96d1260e87ad48ce78f516cbf8688a31aeab05384e93209b3f8ebadc8cc896a2847a691570d6483fd1d24193f8fee5f62adae5',
        redirect_uri: 'localhost:4201',
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
