import { TNode } from '@udecode/plate-core'

export interface RichTextEditorV2Props {
  id: string
  defaultValue?: TNode[]
  onChange?: (newValue: TNode[]) => void
}
