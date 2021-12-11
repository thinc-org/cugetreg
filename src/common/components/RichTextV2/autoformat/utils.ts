/**
 * Reference
 * https://github.com/udecode/plate/blob/main/docs/src/live/config/autoformat/autoformatUtils.ts
 */
import { AutoformatBlockRule } from '@udecode/plate-autoformat'
import { getParent, isElement, PlateEditor, TEditor } from '@udecode/plate-core'
import { toggleList, unwrapList } from '@udecode/plate-list'

export const clearBlockFormat: AutoformatBlockRule['preFormat'] = (editor) => unwrapList(editor as PlateEditor)

// eslint-disable-next-line
export const format = (editor: TEditor, customFormatting: any) => {
  if (editor.selection) {
    const parentEntry = getParent(editor, editor.selection)
    if (!parentEntry) return
    const [node] = parentEntry
    if (isElement(node)) {
      customFormatting()
    }
  }
}

export const formatList = (editor: TEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor as PlateEditor, {
      type: elementType,
    })
  )
}

export const formatText = (editor: TEditor, text: string) => {
  format(editor, () => editor.insertText(text))
}
