import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { OpensearchModule } from 'nestjs-opensearch'

import { SearchService } from './search.service'

@Module({
  imports: [
    ConfigModule,
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
            rejectUnauthorized: !configService.get<boolean>('opensearchSkipSSL'),
          },
        }
      },
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
