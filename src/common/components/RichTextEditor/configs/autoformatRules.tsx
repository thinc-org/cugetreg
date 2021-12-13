import { autoformatArrow, autoformatLegalHtml, autoformatMath, AutoformatPlugin } from '@udecode/plate-autoformat'

import { autoformatBlocks } from '../autoformat/block'
import { autoformatLists } from '../autoformat/list'
import { autoformatMarks } from '../autoformat/mark'

export const autoformatOptions: AutoformatPlugin = {
  rules: [
    ...autoformatBlocks,
    ...autoformatLists,
    ...autoformatMarks,
    ...autoformatArrow,
    ...autoformatLegalHtml,
    ...autoformatMath,
  ],
}
