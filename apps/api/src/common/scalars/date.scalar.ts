import { ValidationError } from '@nestjs/apollo'
import { CustomScalar, Scalar } from '@nestjs/graphql'

import { Kind, ValueNode } from 'graphql'

@Scalar('Date')
export class DateScalar implements CustomScalar<string, Date> {
  description =
    'Date custom scalar type, for (de)serializing Date values from/to ISO8601 representation.'

  parseValue(value: unknown): Date {
    if (typeof value !== 'string') {
      throw new ValidationError('Cannot parse value for Date scalar. Value must be string.')
    }
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      throw new ValidationError('Cannot parse value for Date scalar. Value must be valid date.')
    }
    return date
  }

  serialize(value: unknown): string {
    if (!(value instanceof Date)) {
      throw new ValidationError('Cannot serialize value for Date scalar. Value must be Date.')
    }
    if (isNaN(value.getTime())) {
      throw new ValidationError('Cannot serialize value for Date scalar. Value must be valid date.')
    }
    return value.toISOString()
  }

  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value)
    }
    return null
  }
}
