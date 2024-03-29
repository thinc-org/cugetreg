/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import cookieParser from 'cookie-parser'

import { AppModule } from './app/app.module'
import { Configuration, validateConfig } from './config/configuration'
import { createLogger } from './util/logger'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: createLogger(),
  })

  const configService = app.get<ConfigService<Configuration>>(ConfigService)
  validateConfig(configService)

  // Setup Cookie Parser
  app.use(cookieParser())

  // Setup the global prefix
  const globalPrefix = '_api'
  app.setGlobalPrefix(globalPrefix)

  // Enable CORS policy
  const origin = configService.get<string>('origin')
  app.enableCors({ origin: origin })
  app.set('trust proxy', 1)

  // Setup application port
  const port = configService.get<number>('port') || 3333
  await app.listen(port, () => {
    Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
  })
}

// Run main application
bootstrap()
