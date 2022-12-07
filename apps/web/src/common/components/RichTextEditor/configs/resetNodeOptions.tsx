import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote'
import { isBlockAboveEmpty, isSelectionAtBlockStart } from '@udecode/plate-core'
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { ResetNodePlugin } from '@udecode/plate-reset-node'

const resetBlockTypesCommonRule = {
  types: [ELEMENT_BLOCKQUOTE],
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
