import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Configuration {
  mongoURI: string
  port: number
  origin: string
  googleOAuthId: string
  googleOAuthSecret: string
  backendPublicUrl: string
  jwtSecret: string
  adminToken: string
  clientLoggerUrl: string
  computationBackendUrl: string
  computationBackendAuthToken: string
  slackWebhookUrl: string
  discordWebhookUrl: string
  reviewDashboardUrl: string
  env: string
  opensearchUrl: string
  opensearchUsername: string
  opensearchPassword: string
  opensearchSkipSSL: boolean
  courseIndexName: string
  openaiApiKey: string
}

export const configuration = (): Configuration => {
  return {
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/cugetreg',
    port: parseInt(process.env.PORT, 10) || 3333,
    origin: process.env.CORS_ORIGIN || '*',
    googleOAuthId: process.env.GOOGLE_OAUTH_ID,
    googleOAuthSecret: process.env.GOOGLE_OAUTH_SECRET,
    backendPublicUrl: process.env.BACKEND_PUBLIC_URL,
    jwtSecret: process.env.JWT_SECRET,
    adminToken: process.env.ADMIN_TOKEN,
    clientLoggerUrl: process.env.CLIENT_LOGGER_URL,
    computationBackendUrl: process.env.COMPUTATION_BACKEND_URL,
    computationBackendAuthToken: process.env.COMPUTATION_BACKEND_AUTHTOKEN,
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    reviewDashboardUrl: process.env.REVIEW_DASHBOARD_URL,
    env: process.env.ENV || 'development',
    opensearchUrl: process.env.OPENSEARCH_URL,
    opensearchUsername: process.env.OPENSEARCH_USERNAME,
    opensearchPassword: process.env.OPENSEARCH_PASSWORD,
    opensearchSkipSSL: process.env.OPENSEARCH_SKIP_SSL === 'true',
    courseIndexName: process.env.COURSE_INDEX_NAME,
    openaiApiKey: process.env.OPENAI_API_KEY,
  }
}

const requiredConfigs = [
  'googleOAuthId',
  'googleOAuthSecret',
  'jwtSecret',
  'adminToken',
  'computationBackendUrl',
  'backendPublicUrl',
  'opensearchUrl',
  'opensearchUsername',
  'opensearchPassword',
  'courseIndexName',
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
