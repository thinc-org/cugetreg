import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

import { Request, Response } from 'express'

import { AuthGuard } from './auth.guard'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async sayHello() {
    return 'Hello'
  }

  // TODO: Remove this route
  @Post('test')
  async testPost(@Res() res: Response) {
    res.send('Hello')
  }

  @Get('/validateCode')
  async auth(@Query() query, @Res({ passthrough: true }) res: Response) {
    if (!query.code) {
      throw new BadRequestException('authentication code is required')
    }

    try {
      const payload = await this.authService.verifyAuthenticationCode(query.code)

      const id_token = payload.id_token

      const userInfo = await this.authService.validateIdToken(id_token)
      const access_token = await this.authService.issueAccessToken(userInfo)

      // TODO: Generate new token
      this.setCookie(res, 'access_token', access_token)

      return res.status(200).json({ message: 'Validate code successfully' })
    } catch (err) {
      return res.status(400).json({ message: 'Something went wrong' })
    }
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

  // TODO: lessen expiry
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
      secure: true,
    })
  }
}
