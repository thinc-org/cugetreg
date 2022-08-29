import type { Request, Response } from 'express'

export interface GraphQLExpressContext {
  req: Request
  res: Response
}
