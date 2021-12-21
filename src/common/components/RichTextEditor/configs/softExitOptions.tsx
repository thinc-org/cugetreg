import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote'
import { SoftBreakPlugin } from '@udecode/plate-break'

export const softBreakOptions: SoftBreakPlugin = {
  rules: [
    { hotkey: 'shift+enter' },
    {
      hotkey: 'enter',
      query: {
        allow: [ELEMENT_BLOCKQUOTE],
      },
    },
  ],
}
