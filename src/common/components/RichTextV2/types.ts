import { TNode } from '@udecode/plate'

export interface RichTextEditorV2Props {
  id: string
  defaultValue?: TNode[]
  onChange?: (newValue: TNode[]) => void
}
