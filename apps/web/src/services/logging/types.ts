export type LogKind = 'track' | 'error' | 'fine-tracking'

export interface LogEvent {
  kind: LogKind
  message: string
  detail?: string
  additionalData?: Record<string, string>
}

export interface ClientLogDTO {
  kind: string
  message: string
  detail?: string
  accessToken?: string
  deviceId: string
  sessionId: string
  additionalData?: Record<string, string>
}
