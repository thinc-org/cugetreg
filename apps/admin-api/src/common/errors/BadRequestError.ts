import { GraphQLError } from 'graphql'

export class BadRequestError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: {
        code: 'BAD_REQUEST',
      },
    })
  }
}
