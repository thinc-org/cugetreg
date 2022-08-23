import { CustomScalar, Scalar } from '@nestjs/graphql'

import { Kind, ValueNode } from 'graphql'

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description = 'Date custom scalar type'

  parseValue(value: string): Date {
    return new Date(value) // value from the client
  }

  serialize(value: Date): string {
    return value.toISOString() // value sent to the client
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
}
