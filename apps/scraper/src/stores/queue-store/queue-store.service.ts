import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class QueueStoreService {
  // For storing fetching queu state
  length = 0
  private _current = 0
  private _roundFinishCbs: (() => void)[] = []
  maxRequestsPerJob: number

  constructor(private readonly configService: ConfigService) {
    this.maxRequestsPerJob = this.configService.get<number>("rateLimit.maxRequestsPerJob")
  }

  isQueueFetchFinished = false

  public get current(): number {
    return this._current
  }

  public reset() {
    this._current = 0
    this.length = 0
    this._roundFinishCbs = []
    this.isQueueFetchFinished = false
  }

  public increment(count: number): void {
    this._current += count

    if (this._current >= this.length) {
      this._roundFinishCbs.forEach(cb => cb())
    }
  }

  public onRoundFinished(callback: () => void): Promise<void> {
    this._roundFinishCbs.push(callback)
    return new Promise<void>(resolve => {
      this._roundFinishCbs.push(resolve)
    })
  }
}
