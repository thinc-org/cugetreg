import { RichTextElementType } from '../../types'
import { RichTextElementProps } from './types'

export const RichTextElement: React.FC<RichTextElementProps> = ({ attributes, children, element }) => {
  switch (element.type) {
    case RichTextElementType.HEADING:
      return <h1 {...attributes}>{children}</h1>
    case RichTextElementType.SUB_HEADING:
      return <h2 {...attributes}>{children}</h2>
    case RichTextElementType.BLOCK_QUOTE:
      return <blockquote {...attributes}>{children}</blockquote>
    case RichTextElementType.ORDER_LIST:
      return <ol {...attributes}>{children}</ol>
    case RichTextElementType.UNORDER_LIST:
      return <ul {...attributes}>{children}</ul>
    case RichTextElementType.LIST:
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}
