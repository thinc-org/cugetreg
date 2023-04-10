import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('In auth guard')

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromCookie(request)
    console.log(`Token: ${token}`)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
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
    console.log(`Cookies: ${request.cookies['access_token']}`)
    const token = request.cookies['access_token']
    // const [type, token] = request.headers.authorization?.split(' ') ?? []
    return token
  }
}
