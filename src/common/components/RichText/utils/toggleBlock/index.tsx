import { includes } from 'lodash'
import { Editor, Transforms, Element as SlateElement } from 'slate'

import { RichTextBlockType } from '../../types'
import { isBlockActive } from '../isBlockActive'

export const toggleBlock = (editor: Editor, format: RichTextBlockType) => {
  const LIST_TYPES = [RichTextBlockType.ORDER_LIST, RichTextBlockType.UNORDER_LIST]

  const isActive = isBlockActive(editor, format)
  const isList = includes(LIST_TYPES, format)

  Transforms.unwrapNodes(editor, {
    match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && includes(LIST_TYPES, node.type),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? RichTextBlockType.PARAGRAPH : isList ? RichTextBlockType.LIST_ITEM : format,
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}
