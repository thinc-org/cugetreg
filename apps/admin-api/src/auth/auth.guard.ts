import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

import { Request } from 'express'

import { SKIP_AUTH } from '@admin-api/common/decorators/SkipAuth'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const isSkippedAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      ctx.getHandler(),
      ctx.getClass(),
    ])
    if (isSkippedAuth) return true

    if (!ctx.getContext()?.req) throw new UnauthorizedException("Can't find request object")
    const request = ctx.getContext()?.req

    const token = this.extractTokenFromCookie(request)
    try {
      const payload = await this.jwtService.verifyAsync(token)
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload
    } catch {
      throw new UnauthorizedException("Can't verify access token")
    }
    return true
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    if (!request.cookies || !request.cookies['access_token'])
      throw new UnauthorizedException("Can't find cookie or access token in cookie")
    const token = request.cookies['access_token']
    return token
  }
}
