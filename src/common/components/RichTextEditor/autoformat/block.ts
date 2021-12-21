import { AutoformatRule } from '@udecode/plate-autoformat'
import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote'
import { ELEMENT_H1 } from '@udecode/plate-heading'

import { clearBlockFormat } from './utils'

/**
 * Reference
 * https://github.com/udecode/plate/blob/main/docs/src/live/config/autoformat/autoformatBlocks.ts
 */
export const autoformatBlocks: AutoformatRule[] = [
  {
    mode: 'block',
    type: ELEMENT_H1,
    match: '# ',
    preFormat: clearBlockFormat,
  },
  {
    mode: 'block',
    type: ELEMENT_BLOCKQUOTE,
    match: '> ',
    preFormat: clearBlockFormat,
  },
]
