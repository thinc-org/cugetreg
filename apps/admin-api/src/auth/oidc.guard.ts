import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { GraphQLExpressContext } from '../common/types/context.type'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const request = ctx.getContext<GraphQLExpressContext>().req
    return ctx.getContext().req
    // return this.validateRequest(request)
  }

  // async validateRequest(request: any): Promise<boolean> {
  //   return request['roles'].includes('admin')
  // }
}
