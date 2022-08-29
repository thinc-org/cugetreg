import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { Cron } from '@nestjs/schedule'

import { IncomingWebhook } from '@slack/webhook'
import { Model } from 'mongoose'

import { ReviewStatus } from '../graphql'
import { ReviewDocument } from '../schemas/review.schema'

@Injectable()
export class ReviewCron {
  private logger = new Logger('ReviewCron')
  private webhook: IncomingWebhook

  constructor(
    private configService: ConfigService,
    @InjectModel('review') private reviewModel: Model<ReviewDocument>
  ) {
    const url = this.configService.get<string>('slackWebhookUrl')
    if (url) {
      this.webhook = new IncomingWebhook(url)
    }
  }

  @Cron('0 0 19 * * *', { timeZone: 'Asia/Bangkok' })
  async alertPendingReviews() {
    const env = this.configService.get<string>('env')
    if (env != 'production') {
      return
    }
    const pendingReviewCount = await this.reviewModel.count({
      status: ReviewStatus.PENDING,
    })
    if (pendingReviewCount > 0) {
      this.logger.log(`There are ${pendingReviewCount} pending reviews, alerting team via Slack...`)
      await this.webhook.send({
        text: `There are *${pendingReviewCount}* pending reviews. Review them now in <https://appsmith.internal.cugetreg.com/applications/6155d8914a99086ac822a925/pages/61b73ebe0599052fee9c8295|Review Dashboard>.`,
      })
    }
  }
}
