import { ALL_CATEGORIES, ALL_FACULTIES } from '@/hooks/useAnnouncement/const'
import { TagType } from '@/hooks/useAnnouncement'

export type CategorySearchTag = TagType | typeof ALL_CATEGORIES
export type Faculty = 'key1' | 'key2' | typeof ALL_FACULTIES
