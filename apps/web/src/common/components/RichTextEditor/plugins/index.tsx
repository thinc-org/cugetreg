import { css } from '@mui/material'
import { createAutoformatPlugin } from '@udecode/plate-autoformat'
import {
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  createBoldPlugin,
  createCodePlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
} from '@udecode/plate-basic-marks'
import { ELEMENT_BLOCKQUOTE, createBlockquotePlugin } from '@udecode/plate-block-quote'
import { BlockquoteElement } from '@udecode/plate-block-quote-ui'
import { createExitBreakPlugin, createSoftBreakPlugin } from '@udecode/plate-break'
import { createPlugins, withProps } from '@udecode/plate-core'
import { ELEMENT_H1, createHeadingPlugin } from '@udecode/plate-heading'
import { createIndentPlugin } from '@udecode/plate-indent'
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL, createListPlugin } from '@udecode/plate-list'
import { ELEMENT_PARAGRAPH, createParagraphPlugin } from '@udecode/plate-paragraph'
import { createResetNodePlugin } from '@udecode/plate-reset-node'
import { StyledElement, StyledLeaf } from '@udecode/plate-styled-components'

import {
  RichTextBlockHotkey,
  RichTextMarkHotkey,
} from '@web/common/components/RichTextEditor/constants'

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
    components: {
      /** Element */
      [ELEMENT_BLOCKQUOTE]: BlockquoteElement,
      // @ts-expect-error incompatible types
      [ELEMENT_H1]: withProps(StyledElement, { as: 'h1' }),
      // @ts-expect-error incompatible types
      [ELEMENT_LI]: withProps(StyledElement, { as: 'li' }),
      // @ts-expect-error incompatible types
      [ELEMENT_UL]: withProps(StyledElement, {
        as: 'ul',
        styles: {
          root: css`
            margin: 0;
            padding-inline-start: 24px;
          `,
        },
      }),
      // @ts-expect-error incompatible types
      [ELEMENT_OL]: withProps(StyledElement, {
        as: 'ol',
        styles: {
          root: css`
            margin: 0;
            padding-inline-start: 24px;
          `,
        },
      }),
      // @ts-expect-error incompatible types
      [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
        as: 'p',
        styles: {
          root: css`
            margin: 0;
            padding: 8px 0;
          `,
        },
        prefixClassNames: 'p',
      }),
      /** Mark */
      // @ts-expect-error incompatible types
      [MARK_BOLD]: withProps(StyledLeaf, { as: 'strong' }),
      // @ts-expect-error incompatible types
      [MARK_CODE]: withProps(StyledLeaf, { as: 'code' }),
      // @ts-expect-error incompatible types
      [MARK_ITALIC]: withProps(StyledLeaf, { as: 'em' }),
      // @ts-expect-error incompatible types
      [MARK_STRIKETHROUGH]: withProps(StyledLeaf, { as: 's' }),
      // @ts-expect-error incompatible types
      [MARK_UNDERLINE]: withProps(StyledLeaf, { as: 'u' }),
    },
  }
)
