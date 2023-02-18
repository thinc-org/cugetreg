import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Configuration {
  mongoURI: string
  port: number
  origin: string
  googleOAuthId: string
  googleOAuthSecret: string
  jwtSecret: string
  adminToken: string
  clientLoggerUrl: string
<<<<<<< refs/remotes/origin/beta
  dashBoardUrl: string
=======
  slackWebhookUrl: string
>>>>>>> remove unused env from template and config
  env: string
}

export const configuration = (): Configuration => {
  return {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/cugetreg',
    port: parseInt(process.env.PORT, 10) || 3333,
    origin: process.env.CORS_ORIGIN || '*',
    googleOAuthId: process.env.GOOGLE_OAUTH_ID,
    googleOAuthSecret: process.env.GOOGLE_OAUTH_SECRET,
    jwtSecret: process.env.JWT_SECRET,
    adminToken: process.env.ADMIN_TOKEN,
    clientLoggerUrl: process.env.CLIENT_LOGGER_URL,
<<<<<<< refs/remotes/origin/beta
    dashBoardUrl: process.env.DASHBOARD_URL,
=======
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
>>>>>>> remove unused env from template and config
    env: process.env.ENV || 'development',
  }
}

<<<<<<< refs/remotes/origin/beta
const requiredConfigs = ['googleOAuthId', 'googleOAuthSecret', 'jwtSecret', 'adminToken']
=======
const requiredConfigs = [
  'googleOAuthId',
  'googleOAuthSecret',
  'jwtSecret',
  'adminToken',
  'backendPublicUrl',
]
>>>>>>> remove unused env from template and config

export function validateConfig(configService: ConfigService<Configuration>): void {
  const logger = new Logger('ConfigService')
  for (const key of requiredConfigs) {
    const value = configService.get(key as keyof Configuration)
    if (!value) {
      logger.error(`Config "${key}" is undefined.`)
    }
  }
}
