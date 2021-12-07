import { Editor } from 'slate'

import { CustomText } from '../../types'

export function isMarkActive(editor: Editor, format: keyof Omit<CustomText, 'text'>): boolean {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}
