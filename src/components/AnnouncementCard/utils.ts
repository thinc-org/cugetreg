import { TagType } from '@/hooks/useAnnouncement/type'
import { GENEDS } from '@/utils/const'

export const isGenEd = (tag: TagType) => {
  return Object.keys(GENEDS).includes(tag)
}
