import { TNode } from '@udecode/plate'

export interface RichTextEditorV2Props {
  id: string
  onChange?: (newValue: TNode[]) => void
}
