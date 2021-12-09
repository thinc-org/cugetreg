import { AutoformatRule, ELEMENT_BLOCKQUOTE, ELEMENT_H1 } from '@udecode/plate'

import { clearBlockFormat } from './utils'

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
