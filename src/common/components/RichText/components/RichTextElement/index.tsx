import { RichTextBlockType } from '../../types'
import { RichTextElementProps } from './types'

export const RichTextElement: React.FC<RichTextElementProps> = ({ attributes, children, element }) => {
  switch (element.type) {
    case RichTextBlockType.HEADING:
      return <h1 {...attributes}>{children}</h1>
    case RichTextBlockType.SUB_HEADING:
      return <h2 {...attributes}>{children}</h2>
    case RichTextBlockType.BLOCK_QUOTE:
      return <blockquote {...attributes}>{children}</blockquote>
    case RichTextBlockType.ORDER_LIST:
      return <ol {...attributes}>{children}</ol>
    case RichTextBlockType.UNORDER_LIST:
      return <ul {...attributes}>{children}</ul>
    case RichTextBlockType.LIST_ITEM:
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}
