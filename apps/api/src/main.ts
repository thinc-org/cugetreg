/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WinstonModule } from "nest-winston"
import * as winston from "winston"

import * as cookieParser from 'cookie-parser'

import { AppModule } from './app/app.module'
import { Configuration, validateConfig } from './config/configuration'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      handleExceptions: true,
      handleRejections: true,
      defaultMeta: {
        app: "cgr-api",
      },
      transports: [
        new winston.transports.Console({format: winston.format.combine(
          winston.format.colorize({all: true}),
          winston.format.simple(),
        )}),
        new winston.transports.File({filename: "log/app.log", format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )}),
      ]
    })
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
