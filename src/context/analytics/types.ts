export interface AnalyticsType {
  addEvent: (e: UserEvent) => void
}

export interface UserEvent {
  value?: string
  elementName: string
  elementId?: string
  eventType: string
  pathname: string
  pathId?: string
  timeStamp: Date
}
