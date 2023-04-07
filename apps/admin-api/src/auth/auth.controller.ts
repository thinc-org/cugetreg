import { BadRequestException, Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { randomBytes } from 'crypto'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    readonly configService: ConfigService,
    readonly jwtService: JwtService
  ) {}

  @Get()
  async requestAuth() {
    const code: string = randomBytes(64).toString('base64')

    return await this.authService.requestAuthentik(code)
  }

  @Post()
  async auth(@Body() body: { authenticationCode: string }): Promise<any> {
    const payload = await this.authService.verify(body.authenticationCode)
    const decodedPayload = this.jwtService.decode(payload)
    return decodedPayload
  }

  @Post('idtoken')
  async authWithIdToken(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { idToken } = body
    if (!idToken) {
      throw new BadRequestException('idToken is required')
    }
    const accessToken = await this.authService.validateIdToken(idToken)
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
