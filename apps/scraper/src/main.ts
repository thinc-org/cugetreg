import { LogLevel, Logger } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ScraperService } from "scraper/scraper.service"
import { validateConfig } from "config/configuration"

async function bootstrap() {
  const logLevels: LogLevel[] = ["log", "error", "warn"]
  if (process.env.LOG_DEBUG === "true") {
    logLevels.push("debug")
  }
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  })
  const configService = app.get(ConfigService)
  validateConfig(configService)

  const port = configService.get<number>("port")

  await app.listen(port, () => {
    Logger.log(`🚀 App listening on port ${port}`)
  })

  const scraperService = app.get(ScraperService)

  // initial scrape on startup
  scraperService.scrape()
}
bootstrap()
