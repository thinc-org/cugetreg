import { BadRequestException, Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { Request, Response } from 'express'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  async sayHello() {
    return 'Hello'
  }

  @Post()
  async auth(@Query() query, @Res({ passthrough: true }) res: Response) {
    // console.log('Code: ', params.code)
    console.log(query)
    if (!query.code) {
      throw new BadRequestException('authentication code is required')
    }

    const payload = await this.authService.verifyAuthenticationCode(query.code)
    const { accessToken, idToken } = payload

    this.authService.validateIdToken(idToken)

    this.setCookie(res, 'accessToken', accessToken)

    return { success: true }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken')
  }

  @Post('/accesstoken')
  async getAccessToken(@Req() req: Request) {
    const token = req.cookies['accessToken']
    if (!token) throw new BadRequestException('Not logged in')
    return {
      accessToken: await this.authService.issueAccessToken(token),
    }
  }

  private setCookie(
    res: Response,
    name: string,
    value: string,
    httpOnly = true,
    maxAge = 1000 * 60 * 60 * 24 * 30 * 6
  ) {
    res.cookie(name, value, {
      httpOnly,
      maxAge,
    })
  }
}
