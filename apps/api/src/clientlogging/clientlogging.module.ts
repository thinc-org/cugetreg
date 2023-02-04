import { Module, forwardRef, Provider } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from "@opensearch-project/opensearch"

import { AuthModule } from '../auth/auth.module'
import { ClientLoggingController } from './clientlogging.controller'
import { ClientLoggingService } from './clientlogging.service'

const elasticProvider: Provider<Client> = {
  provide: Client,
  useFactory: (configService: ConfigService) => new Client({
    node: configService.get("elasticUrl"),
    auth: {
      username: configService.get("elasticUsername"),
      password: configService.get("elasticPassword"),
    },
    ssl: {
      rejectUnauthorized: false,
    }
  }),
  inject: [ConfigService],
}

@Module({
  providers: [ClientLoggingService, elasticProvider],
  controllers: [ClientLoggingController],
  imports: [forwardRef(() => AuthModule)],
  exports: [ClientLoggingService],
})
export class ClientLoggingModule { }
