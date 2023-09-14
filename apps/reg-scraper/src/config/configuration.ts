import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export interface Configuration {
  mongoURI: string
  redisURL: string
  redisKeyPrefix: string
  port: number
  logDebug: boolean
  courseDescPath: string
  rateLimit: {
    maxRequestsPerJob: number
    cycleDurationMs: number
    maxJobs: number
  }
  scraper: {
    academicYears: string[]
    studyPrograms: string[]
    semesters: string[]
  }
  opensearch: {
    url: string
    username: string
    password: string
    skipSSL: boolean
  }
  courseIndexName: string
}

export const configuration = (): Configuration => ({
  mongoURI: process.env.MONGO_URI,
  redisURL: process.env.REDIS_URL,
  redisKeyPrefix: process.env.REDIS_KEY_PREFIX,
  port: parseInt(process.env.PORT, 10) || 3000,
  logDebug: process.env.LOG_DEBUG === 'true',
  courseDescPath: process.env.COURSE_DESC_PATH,
  rateLimit: {
    maxRequestsPerJob: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS_PER_JOB) || 25,
    cycleDurationMs: parseInt(process.env.RATE_LIMIT_CYCLE_DURATION_MS) || 500,
    maxJobs: parseInt(process.env.RATE_LIMIT_MAX_JOBS) || 1,
  },
  scraper: {
    academicYears: process.env.SCRAPER_ACADEMIC_YEARS?.split(','),
    studyPrograms: process.env.SCRAPER_STUDY_PROGRAMS?.split(','),
    semesters: process.env.SCRAPER_SEMESTERS?.split(','),
  },
  opensearch: {
    url: process.env.OPENSEARCH_URL,
    username: process.env.OPENSEARCH_USERNAME,
    password: process.env.OPENSEARCH_PASSWORD,
    skipSSL: process.env.OPENSEARCH_SKIP_SSL === 'true',
  },
  courseIndexName: process.env.COURSE_INDEX_NAME,
})

const requiredConfigs = [
  'mongoURI',
  'redisURL',
  'redisKeyPrefix',
  'courseDescPath',
  'scraper.academicYears',
  'scraper.studyPrograms',
  'scraper.semesters',
]

export function validateConfig(configService: ConfigService<Configuration>): void {
  const logger = new Logger('ConfigService')
  const missingKeys: string[] = []
  for (const key of requiredConfigs) {
    const value = configService.get(key as keyof Configuration)
    if (!value) {
      missingKeys.push(key)
    }
  }
  if (missingKeys.length > 0) {
    logger.error(`Config keys [${missingKeys}] is undefined.`)
    throw new Error(
      `Required config keys [${missingKeys}] are missing. Please recheck environment variables.`
    )
  }
}
