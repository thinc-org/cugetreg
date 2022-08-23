import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common'

import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger('HttpExceptionsFilter')
  catch(exception: HttpException, host: ArgumentsHost) {
    const status = exception.getStatus()
    if (status >= 500) {
      this.logger.error(exception.getResponse())
    }

    if (host.getType() === 'http') {
      const response = host.switchToHttp().getResponse<Response>()
      response.status(status).json(exception.getResponse())
    }
  }
}
