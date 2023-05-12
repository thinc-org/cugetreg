import { ValidationError } from '@nestjs/apollo'
import { CustomScalar, Scalar } from '@nestjs/graphql'

import { Kind, ValueNode } from 'graphql'

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description =
    'Date custom scalar type, for (de)serializing Date values from/to ISO8601 representation.'

  parseValue(value: unknown): Date {
    if (typeof value === 'string') {
      return new Date(value)
    }
    throw new ValidationError('Cannot parse value for Date scalar. Value must be string.')
  }

  serialize(value: unknown): string {
    if (value instanceof Date) {
      return value.toISOString()
    }
    throw new ValidationError('Cannot serialize value for Date scalar. Value must be Date.')
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
}
