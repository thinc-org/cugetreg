import { GraphQLError } from 'graphql'

export class NotFoundError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'NOT_FOUND',
      },
    })
  }
}
