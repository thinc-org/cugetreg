import { Editor } from 'slate'

import { CustomText } from '../../types'
import { isMarkActive } from '../isMarkActive'

export function toggleMark(editor: Editor, format: keyof Omit<CustomText, 'text'>) {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    editor.removeMark(format)
  } else {
    editor.addMark(format, true)
  }
}
