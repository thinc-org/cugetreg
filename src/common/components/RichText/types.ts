import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

export const RichTextMarkType = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strike through',
  CODE: 'code',
} as const
export type RichTextMarkType = ValueOf<typeof RichTextMarkType>

export const RichTextMarkTag: Record<keyof typeof RichTextMarkType, string> = {
  BOLD: 'b',
  ITALIC: 'i',
  UNDERLINE: 'u',
  STRIKETHROUGH: 's',
  CODE: 'code',
} as const
export type RichTextMarkTag = ValueOf<typeof RichTextMarkTag>

export const RichTextBlockType = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  SUB_HEADING: 'sub heading',
  BLOCK_QUOTE: 'block quote',
  ORDER_LIST: 'order list',
  UNORDER_LIST: 'unorder list',
  LIST_ITEM: 'list',
} as const
export type RichTextBlockType = ValueOf<typeof RichTextBlockType>

export const RichTextBlockTag: Record<keyof typeof RichTextBlockType, string> = {
  PARAGRAPH: 'p',
  HEADING: 'h1',
  SUB_HEADING: 'h2',
  BLOCK_QUOTE: 'blockquote',
  ORDER_LIST: 'ol',
  UNORDER_LIST: 'ul',
  LIST_ITEM: 'li',
} as const
export type RichTextBlockTag = ValueOf<typeof RichTextBlockTag>

export const RichTextActionType = {
  UNDO: 'undo',
  REDO: 'redo',
} as const
export type RichTextActionType = ValueOf<typeof RichTextActionType>

export type CustomText = {
  text: string
  [RichTextMarkType.BOLD]?: boolean
  [RichTextMarkType.ITALIC]?: boolean
  [RichTextMarkType.UNDERLINE]?: boolean
  [RichTextMarkType.STRIKETHROUGH]?: boolean
  [RichTextMarkType.CODE]?: boolean
}

export type CustomElement = {
  type: RichTextMarkType | RichTextBlockType
  children: CustomText[]
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: CustomElement
    Text: CustomText
  }
}

export interface RichTextEditorProps {
  /* eslint-disable */
  value: string
  onChange: (value: string) => void
}

export interface RichTextRendererProps {
  value: string
}
