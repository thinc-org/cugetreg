import { Editor, Element as SlateElement } from 'slate'

import { RichTextBlockType } from '../../types'

export const isBlockActive = (editor: Editor, format: RichTextBlockType): boolean => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (node) => !Editor.isEditor(node) && SlateElement.isElement(node) && node.type === format,
  })

  return !!match
}
