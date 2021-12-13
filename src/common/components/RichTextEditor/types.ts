import { TNode } from '@udecode/plate-core'

export interface RichTextEditorProps {
  id: string
  defaultValue?: TNode[]
  onChange?: (newValue: TNode[]) => void
}
