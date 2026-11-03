import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

import { createHash, timingSafeEqual } from 'crypto'

import { GraphQLExpressContext } from '../common/types/context.type'

const sha256 = (value: string) => createHash('sha256').update(value).digest()

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const adminToken = process.env.ADMIN_TOKEN
    // Fail closed: an unset token would otherwise accept the literal "Bearer undefined".
    if (!adminToken) return false

    const ctx = GqlExecutionContext.create(context)
    const header = ctx.getContext<GraphQLExpressContext>().req.headers['authorization']
    if (typeof header !== 'string') return false

    return timingSafeEqual(sha256(header), sha256(`Bearer ${adminToken}`))
  }
}
