import { SetMetadata } from '@nestjs/common'

export const SKIP_AUTH = 'isSkippedAuth'
export const SkipAuth = () => SetMetadata(SKIP_AUTH, true)
