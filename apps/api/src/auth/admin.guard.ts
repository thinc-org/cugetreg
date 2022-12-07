import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GraphQLExpressContext } from '../common/types/context.type'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext<GraphQLExpressContext>().req
    return request.headers['authorization'] === `Bearer ${process.env.ADMIN_TOKEN}`
  }
}
