import { Module, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { OpensearchModule } from 'nestjs-opensearch'

import { AuthModule } from '../auth/auth.module'
import { ClientLoggingController } from './clientlogging.controller'
import { ClientLoggingService } from './clientlogging.service'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    OpensearchModule.forRootAsync({
      clientName: 'default',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          nodes: configService.get<string>('opensearchUrl'),
          auth: {
            username: configService.get<string>('opensearchUsername'),
            password: configService.get<string>('opensearchPassword'),
          },
          ssl: {
            rejectUnauthorized: configService.get<boolean>('opensearchSkipSSL'),
          },
        }
      },
    }),
  ],
  providers: [ClientLoggingService],
  controllers: [ClientLoggingController],
  exports: [ClientLoggingService],
})
export class ClientLoggingModule {}
