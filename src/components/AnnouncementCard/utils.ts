import { GENEDS } from '@/utils/const'
import { TagType } from '@/hooks/useAnnouncement'

export const isGenEd = (tag: TagType) => {
  return GENEDS.includes(tag)
}
