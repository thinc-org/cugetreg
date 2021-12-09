import { ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK, ELEMENT_TD, SoftBreakPlugin } from '@udecode/plate'

export const softBreakOptions: SoftBreakPlugin = {
  rules: [
    { hotkey: 'shift+enter' },
    {
      hotkey: 'enter',
      query: {
        allow: [ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD],
      },
    },
  ],
}
