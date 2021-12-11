import {
  createParagraphPlugin,
  createHeadingPlugin,
  createBlockquotePlugin,
  createListPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createResetNodePlugin,
  createExitBreakPlugin,
  createSoftBreakPlugin,
  createAutoformatPlugin,
  createPlugins,
  createPlateUI,
  createIndentPlugin,
  ELEMENT_PARAGRAPH,
  ELEMENT_H1,
} from '@udecode/plate'

import { RichTextBlockHotkey, RichTextMarkHotkey } from '@/common/components/RichTextV2/constants'

import { autoformatOptions } from '../configs/autoformatRules'
import { exitBreakOptions } from '../configs/exitBreakOptions'
import { resetNodeOptions } from '../configs/resetNodeOptions'
import { softBreakOptions } from '../configs/softExitOptions'

export const plugins = createPlugins(
  [
    /** Element */
    createParagraphPlugin({
      options: { hotkey: RichTextBlockHotkey.p },
    }),
    createHeadingPlugin({
      options: {
        levels: 1,
      },
    }),
    createBlockquotePlugin({
      options: { hotkey: RichTextBlockHotkey.blockquote },
    }),
    createListPlugin(),
    createIndentPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1],
        },
      },
    }),
    /** Mark */
    createBoldPlugin({
      options: { hotkey: RichTextMarkHotkey.bold },
    }),
    createItalicPlugin({
      options: { hotkey: RichTextMarkHotkey.italic },
    }),
    createUnderlinePlugin({
      options: { hotkey: RichTextMarkHotkey.underline },
    }),
    createStrikethroughPlugin({
      options: { hotkey: RichTextMarkHotkey.strikethrough },
    }),
    createCodePlugin({
      options: { hotkey: RichTextMarkHotkey.code },
    }),
    /* *Other */
    createExitBreakPlugin({ options: exitBreakOptions }),
    createResetNodePlugin({ options: resetNodeOptions }),
    createSoftBreakPlugin({ options: softBreakOptions }),
    createAutoformatPlugin({ options: autoformatOptions }),
  ],
  {
    components: createPlateUI(),
  }
)
