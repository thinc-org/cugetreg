import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Configuration {
  mongoURI: string
  port: number
  origin: string
  clientId: string
  clientSecret: string
  authorizationUrl: string
  tokenUrl: string
  userInfoUrl: string
  redirectUrl: string
  jwtSecret: string
  clientLoggerUrl: string
  dashBoardUrl: string
  env: string
}

export const configuration = (): Configuration => {
  return {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/cugetreg',
    port: parseInt(process.env.PORT, 10) || 3333,
    origin: process.env.CORS_ORIGIN || '*',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    authorizationUrl: process.env.AUTHORIZATION_URL,
    tokenUrl: process.env.TOKEN_URL,
    userInfoUrl: process.env.USERINFO_URL,
    redirectUrl: process.env.REDIRECT_URL || 'localhost:4201',
    jwtSecret: process.env.JWT_SECRET,
    clientLoggerUrl: process.env.CLIENT_LOGGER_URL,
    dashBoardUrl: process.env.DASHBOARD_URL,
    env: process.env.ENV || 'development',
  }
}

const requiredConfigs = [
  'clientId',
  'clientSecret',
  'authorizationUrl',
  'tokenUrl',
  'userInfoUrl',
  'redirectUrl',
  'jwtSecret',
]

export function validateConfig(configService: ConfigService<Configuration>): void {
  const logger = new Logger('ConfigService')
  for (const key of requiredConfigs) {
    const value = configService.get(key as keyof Configuration)
    if (!value) {
      logger.error(`Config "${key}" is undefined.`)
    }
  }
}
