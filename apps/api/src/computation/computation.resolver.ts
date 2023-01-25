import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Args, Query, Resolver } from '@nestjs/graphql'

import * as grpc from '@grpc/grpc-js'
import * as protoloader from '@grpc/proto-loader'
import { join } from 'path'

import { CourseRecommendationRequest, CourseRecommendationResponse } from '../graphql'

@Resolver('Computation')
export class ComputationResolver {
  private metadata: grpc.Metadata

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private courseRecommendation: any

  constructor(configService: ConfigService) {
    const pkgDef = protoloader.loadSync(join(__dirname, 'assets/cgrcompute.proto'), {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    })
    const descriptor = grpc.loadPackageDefinition(pkgDef)

    const credential = configService.get('computationBackendCredential')
    const clientArgs = [
      configService.get('computationBackendUrl'),
      credential ? grpc.credentials.createSsl() : grpc.credentials.createInsecure(),
    ]
    this.metadata = new grpc.Metadata()
    if (credential) {
      this.metadata.set(
        'cookie',
        'authelia_session=' + configService.get('computationBackendAuthToken') + ';'
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.courseRecommendation = new (descriptor.CourseRecommendation as any)(...clientArgs)
  }

  @Query('recommend')
  recommend(@Args('req') req: CourseRecommendationRequest): Promise<CourseRecommendationResponse> {
    return new Promise((resolve, reject) => {
      this.courseRecommendation.Recommend(req, this.metadata, (err, res) => {
        if (err) {
          Logger.error('Fail to get course recommendation ', {
            err,
            req,
          })
          reject(new Error('Computation Backend Error'))
        }
        resolve(res)
      })
    })
  }
}
