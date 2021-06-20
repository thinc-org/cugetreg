import { GenEdChipKey, DayChipKey } from '@/components/Chips/config'

export interface FilteredTagProps {
  tags: (GenEdChipKey | DayChipKey)[]
  addTag: (tag: GenEdChipKey | DayChipKey) => void
  removeTag: (tag: GenEdChipKey | DayChipKey) => void
  openFilterBar: boolean
  setOpenFilterBar: React.Dispatch<React.SetStateAction<boolean>>
}

export const DEFAULT_FILTERED_TAG_CONTEXT_VALUE: FilteredTagProps = {
  tags: [],
  addTag: () => null,
  removeTag: () => null,
  openFilterBar: false,
  setOpenFilterBar: () => null,
}
