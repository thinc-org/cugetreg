import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseKeyValuePipe implements PipeTransform<string, Record<string, string>> {
  transform(value: string, metadata: ArgumentMetadata): Record<string, string> {
    const pairs = value.split('&').map((pair) => pair.split('='))

    // there exists a pair that doesn't follow 'key=value' format
    if (pairs.some((pair) => pair.length != 2)) {
      throw new BadRequestException({
        reason: 'KEY_VALUE_PAIR_INVALID',
        message: "Some key value pairs does not contain '-'",
        value: value,
      })
    }

    const pairsRecord: Record<string, string> = {}
    pairs.forEach((pair) => {
      pairsRecord[pair[0]] = pair[1]
    })

    return pairsRecord
  }
}
