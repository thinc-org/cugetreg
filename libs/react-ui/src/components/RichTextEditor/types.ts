import { TNode } from '@udecode/plate-core'

export interface RichTextEditorProps {
  id: string
  defaultValue?: TNode[]
  onChange?: (newValue: TNode[]) => void
}

export interface RichTextEditorRef {
  setValue: (nodes: TNode[]) => void
  deserializeHtml: (html: string) => TNode[]
  serializeHtml: (nodes: TNode[]) => string
}
