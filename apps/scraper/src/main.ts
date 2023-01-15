import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

import { Configuration, validateConfig } from '@scraper/config/configuration'
import { ScraperService } from '@scraper/scraper/scraper.service'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      level: process.env.LOG_DEBUG === 'true' ? 'debug' : 'info',
      handleExceptions: true,
      handleRejections: true,
      defaultMeta: {
        app: 'cgr-scraper',
      },
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.simple()
          ),
        }),
        new winston.transports.File({
          filename: 'log/app.log',
          format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
      ],
    }),
  })
  const configService = app.get(ConfigService<Configuration>)
  validateConfig(configService)

  const port = configService.get<number>('port')

  await app.listen(port, () => {
    Logger.log(`🚀 App listening on port ${port}`)
  })

  const scraperService = app.get(ScraperService)

  // initial scrape on startup
  scraperService.scrape()
}
bootstrap()
