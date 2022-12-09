export const GENED_COLORS = ['pink', 'secondary', 'purple', 'green'] as const
export const OTHER_COLORS = ['orange', 'teal', 'blue', 'indigo', 'primary'] as const
export const SCHEDULE_COLORS = [
  'pink',
  'orange',
  'secondary',
  'green',
  'teal',
  'blue',
  'indigo',
  'purple',
  'primary',
] as const

export type ScheduleColor = typeof SCHEDULE_COLORS[number]
