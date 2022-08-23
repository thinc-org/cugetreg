import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const CurrentUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const gqlContext = GqlExecutionContext.create(context).getContext()
  return gqlContext.req.user._id
})
