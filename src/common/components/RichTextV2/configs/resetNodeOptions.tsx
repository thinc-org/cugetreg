import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  isBlockAboveEmpty,
  isSelectionAtBlockStart,
  ResetNodePlugin,
} from '@udecode/plate'

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE, ELEMENT_TODO_LI],
  defaultType: ELEMENT_PARAGRAPH,
}

export const resetNodeOptions: ResetNodePlugin = {
  rules: [
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Enter',
      predicate: isBlockAboveEmpty,
    },
    {
      ...resetBlockTypesCommonRule,
      hotkey: 'Backspace',
      predicate: isSelectionAtBlockStart,
    },
  ],
}
