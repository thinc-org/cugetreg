import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

import { Request } from 'express'

import { SKIP_AUTH } from '@admin-api/common/decorators/SkipAuth'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isSkippedAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isSkippedAuth) return true

    try {
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromCookie(request)
      console.log(`Token: ${token}`)
      const payload = await this.jwtService.verifyAsync(token)
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (!request.cookies || !request.cookies['access_token']) throw new UnauthorizedException()
    console.log(`Cookies: ${request.cookies['access_token']}`)
    const token = request.cookies['access_token']
    return token
  }
}
