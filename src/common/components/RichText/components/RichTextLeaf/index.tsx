import { RichTextMarkType } from '@/common/components/RichText/types'

import { RichTextLeafProps } from './types'

export const RichTextLeaf: React.FC<RichTextLeafProps> = ({ attributes, children, leaf }) => {
  if (leaf[RichTextMarkType.BOLD]) {
    children = <b>{children}</b>
  }
  if (leaf[RichTextMarkType.ITALIC]) {
    children = <i>{children}</i>
  }
  if (leaf[RichTextMarkType.UNDERLINE]) {
    children = <u>{children}</u>
  }
  if (leaf[RichTextMarkType.STRIKETHROUGH]) {
    children = <s>{children}</s>
  }
  if (leaf[RichTextMarkType.CODE]) {
    children = <code>{children}</code>
  }
  return <span {...attributes}>{children}</span>
}
