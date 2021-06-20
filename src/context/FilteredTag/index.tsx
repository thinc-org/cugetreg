import React, { createContext, useState } from 'react'

import { DayChipKey, GenEdChipKey } from '@/components/Chips/config'
import { DEFAULT_FILTERED_TAG_CONTEXT_VALUE } from '@/context/FilteredTag/constants'

export const FilteredTagContext = createContext(DEFAULT_FILTERED_TAG_CONTEXT_VALUE)

export const FilteredTagProvider: React.FC = (props) => {
  const [tags, setTags] = useState<(GenEdChipKey | DayChipKey)[]>([])
  const [openFilterBar, setOpenFilterBar] = useState<boolean>(false)

  const addTag = (tag: GenEdChipKey | DayChipKey) => {
    setTags((tags) => [...tags, tag])
  }

  const removeTag = (tag: GenEdChipKey | DayChipKey) => {
    setTags((tags) => tags.filter((currentTag) => currentTag != tag))
  }

  const value = { tags, addTag, removeTag, openFilterBar, setOpenFilterBar }

  return <FilteredTagContext.Provider value={value} {...props} />
}
