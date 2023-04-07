import { Controller, Get, UseGuards } from '@nestjs/common'
import { Query } from '@nestjs/graphql'

import { JwtAuthGuard } from '@admin-api/auth/oidc.guard'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Query('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() userId: string): Promise<User> {
    const user = await this.userModel.findById(userId)
    return {
      _id: user._id,
      name: user.name,
    }
  }
}
