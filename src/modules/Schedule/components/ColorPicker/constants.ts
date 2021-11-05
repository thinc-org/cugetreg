export const GENED_COLORS = ['pink', 'secondary', 'purple', 'green'] as const
export const SCHEDULE_COLORS = [...GENED_COLORS, 'orange', 'teal', 'blue', 'indigo', 'primary'] as const

export type GenEdColor = typeof GENED_COLORS[number]
export type ScheduleColor = typeof SCHEDULE_COLORS[number]
