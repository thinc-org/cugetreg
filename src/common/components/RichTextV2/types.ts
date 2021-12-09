import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_CODE_BLOCK,
  ELEMENT_H1,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate'

export interface RichTextEditorV2Props {
  value?: string
  onChange?: (value: string) => void
}

export const RichTextMarkType = {
  BOLD: MARK_BOLD,
  ITALIC: MARK_ITALIC,
  UNDERLINE: MARK_UNDERLINE,
  STRIKETHROUGH: MARK_STRIKETHROUGH,
  CODE: MARK_CODE,
} as const
export type RichTextMarkType = ValueOf<typeof RichTextMarkType>

export const RichTextBlockType = {
  PARAGRAPH: ELEMENT_PARAGRAPH,
  H1: ELEMENT_H1,
  BLOCK_QUOTE: ELEMENT_BLOCKQUOTE,
  ORDER_LIST: ELEMENT_OL,
  UNORDER_LIST: ELEMENT_UL,
  CODE_BLOCK: ELEMENT_CODE_BLOCK,
} as const
export type RichTextBlockType = ValueOf<typeof RichTextBlockType>
