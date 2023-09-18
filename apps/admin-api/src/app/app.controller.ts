import { Controller, Get, Req, UnauthorizedException, UseGuards } from '@nestjs/common'
import { Query } from '@nestjs/graphql'

import { Request } from 'express'

import { AuthService } from '@admin-api/auth/auth.service'
import { JwtAuthGuard } from '@admin-api/auth/oidc.guard'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Query('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    if (!req.cookies['accessToken']) {
      throw new UnauthorizedException('No access token')
    }

    return {
      success: true,
    }
  }
}
