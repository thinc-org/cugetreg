import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Req,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { Request, Response } from 'express'
import 'googleapis'

import { OauthStatePayload } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(readonly authService: AuthService, readonly configService: ConfigService) {}

  @Get('/google')
  @Redirect()
  authWithGoogle(
    @Query('returnUrl') returnUrl: string,
    @Query('backendUrl') overrideBackendUrl?: string
  ) {
    const state = this.createOauthState(returnUrl, overrideBackendUrl)
    this.validateOauthState(state)

    const url = this.authService.generateGoogleOauthClient().generateAuthUrl({
      scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
      ],
      state: JSON.stringify(state),
      redirect_uri: this.authService.getGoogleCallbackUrl(state.overrideBackendUrl),
      access_type: 'online',
      include_granted_scopes: true,
      hd: 'student.chula.ac.th',
    })

    return {
      url,
      statusCode: 302,
    }
  }

  @Post('/google/idtoken')
  async authWithIdToken(
    @Body() body: { idToken: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const { idToken } = body
    const payload = await this.authService.validateGoogleIdToken(idToken)
    if (!payload) throw new BadRequestException('Invalid id token')

    const { refreshToken } = await this.authService.handleGoogleIdToken(payload)
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 * 6,
    })
    return { success: true }
  }

  @Get('/google/callback')
  @Redirect()
  async authWithGoogleCallback(
    @Query('code') code: string,
    @Query('state') stateString = '',
    @Res({ passthrough: true }) res: Response
  ) {
    const state: OauthStatePayload = JSON.parse(stateString)
    this.validateOauthState(state)

    const { refreshToken } = await this.authService.handleGoogleOauthCode(
      code,
      state.overrideBackendUrl
    )
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 * 6,
    })

    return {
      url: state.returnUrl,
    }
  }

  @Post('/logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refreshtoken']
    if (token) await this.authService.revokeRefreshTokenToken(token)
    res.clearCookie('refreshtoken')
  }

  @Post('/refreshtoken')
  async getAccessToken(@Req() req: Request) {
    const token = req.cookies['refreshtoken']
    if (!token) throw new BadRequestException('Not logged in')
    return {
      accessToken: await this.authService.issueAccessToken(token),
    }
  }

  private createOauthState(returnUrl: string, overrideBackendUrl?: string) {
    const state: OauthStatePayload = {
      returnUrl: returnUrl || this.configService.get('backendPublicUrl'),
      overrideBackendUrl: overrideBackendUrl,
    }
    return state
  }

  private validateOauthState(state: OauthStatePayload) {
    if (this.configService.get('env') === 'development') return
    if (state.overrideBackendUrl) {
      throw new BadRequestException(`overriding backendUrl is not allowed in this environment`)
    }
    const backendUrl = this.configService.get('backendPublicUrl')
    const backendOrigin = new URL(backendUrl).origin
    const returnUrlOrigin = new URL(state.returnUrl).origin
    if (backendOrigin !== returnUrlOrigin) {
      throw new BadRequestException(`returnUrl must be the same origin as ${backendUrl}`)
    }
  }
}
