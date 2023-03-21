import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

const stacktraceFormatter = winston.format((entry) => {
  if (entry.stack) {
    entry.stack = JSON.stringify(entry.stack)
  }
  return entry
})

export function createLogger() {
  return WinstonModule.createLogger({
    handleExceptions: true,
    handleRejections: true,
    defaultMeta: {
      app: 'cgr-api',
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
        format: winston.format.combine(
          winston.format.timestamp(),
          stacktraceFormatter(),
          winston.format.json()
        ),
      }),
    ],
  })
}
