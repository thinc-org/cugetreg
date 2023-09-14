import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

import { GraphQLError } from 'graphql'
import { join } from 'path'

import { AuthModule } from '@admin-api/auth/auth.module'
import { OverrideModule } from '@admin-api/override/override.module'

import { GraphQLExpressContext } from '../common/types/context.type'
import { configuration } from '../config/configuration'
import { ReviewModule } from '../review/review.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        // needed in production, to make apollo server work
        typePaths: [join(__dirname, '/../**/*.graphql')],
        definitions:
          configService.get<string>('env') === 'development'
            ? {
                path: join(__dirname, '../graphql.ts'),
                outputAs: 'class',
                enumsAsTypes: true,
              }
            : null,
        playground: true,
        introspection: true,
        cors: {
          origin: configService.get<string>('origin'),
          credentials: true,
        },
        path: '/_api/graphql',
        context: ({ req, res }: GraphQLExpressContext) => ({ req, res }),
        formatError: (formattedError, error: unknown) => {
          if (error instanceof GraphQLError) {
            const graphQLFormattedError = {
              message: error.message,
              path: error.path,
              locations: error.locations,
              extensions: {
                code: error?.extensions?.code,
              },
            }
            return graphQLFormattedError
          }
          return formattedError
        },
        includeStacktraceInErrorResponses: false,
        allowBatchedHttpRequests: true,
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
