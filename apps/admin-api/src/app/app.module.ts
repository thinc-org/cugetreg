import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

import { GraphQLError } from 'graphql'
import { join } from 'path'

import { GraphQLExpressContext } from '../common/types/context.type'
import { configuration } from '../config/configuration'
import { ReviewModule } from '../review/review.module'
import { OverrideModule } from '@admin-api/override/override.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    GraphQLModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // needed in production, to make apollo server work
        typePaths: [join(__dirname, '/../**/*.graphql')],
        definitions: {
          path: join(process.cwd(), 'src/graphql.ts'),
          outputAs: 'class',
        },
        playground: true,
        introspection: true,
        cors: {
          origin: configService.get<string>('origin'),
        },
        path: '/_api/graphql',
        context: ({ req, res }: GraphQLExpressContext) => ({ req, res }),
        formatError: (error: GraphQLError) => {
          const graphQLFormattedError = {
            message: error?.extensions?.exception?.response?.message || error.message,
            path: error.path,
            locations: error.locations,
            reason: error?.extensions?.exception?.response?.reason,
            status: error?.extensions?.exception?.status,
            exception: error?.extensions?.exception,
          }
          return graphQLFormattedError
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongoURI'),
      }),
      inject: [ConfigService],
    }),
    ReviewModule,
    OverrideModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
