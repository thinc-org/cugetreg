export const GENED_COLORS = ['pink', 'secondary', 'purple', 'green'] as const
export const OTHER_COLORS = ['orange', 'teal', 'blue', 'indigo', 'primary'] as const
export const SCHEDULE_COLORS = [...GENED_COLORS, ...OTHER_COLORS] as const

export type ScheduleColor = typeof SCHEDULE_COLORS[number]
