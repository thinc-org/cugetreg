import { BaseEditor, Descendant } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

import { Control } from 'react-hook-form'

import { ReviewState } from '@/modules/CourseDetail/context/Review/types'

export const RichTextFormatType = {
  BOLD: 'bold',
  ITALIC: 'italic',
  UNDERLINE: 'underline',
  STRIKETHROUGH: 'strike through',
  CODE: 'code',
} as const
export type RichTextFormatType = ValueOf<typeof RichTextFormatType>

export const RichTextElementType = {
  PARAGRAPH: 'paragraph',
  HEADING: 'heading',
  SUB_HEADING: 'sub heading',
  BLOCK_QUOTE: 'block quote',
  ORDER_LIST: 'order list',
  UNORDER_LIST: 'unorder list',
  LIST: 'list',
} as const
export type RichTextElementType = ValueOf<typeof RichTextElementType>

export const RichTextActionType = {
  UNDO: 'undo',
  REDO: 'redo',
  COPY: 'copy',
} as const
export type RichTextActionType = ValueOf<typeof RichTextActionType>

export type CustomText = {
  text: string
  [RichTextFormatType.BOLD]?: boolean
  [RichTextFormatType.ITALIC]?: boolean
  [RichTextFormatType.UNDERLINE]?: boolean
  [RichTextFormatType.STRIKETHROUGH]?: boolean
  [RichTextFormatType.CODE]?: boolean
}

export type CustomElement = {
  type: RichTextFormatType | RichTextElementType
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
  control: Control<ReviewState, object>
  name: keyof ReviewState
  onChange: (value: string) => void
}

export interface RichTextRendererProps {
  value: string
}
