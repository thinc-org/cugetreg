import { useTheme } from '@mui/material'
import {
  createPlateEditor,
  deserializeHtml as plateDeserializeHtml,
  Plate,
  serializeHtml as plateSerializeHtml,
  TNode,
  usePlateActions,
} from '@udecode/plate-core'
import { EditableProps } from 'slate-react/dist/components/editable'

import React, { forwardRef, useCallback, useImperativeHandle } from 'react'

import { HighlightHTML } from '../HighlightHTML'
import { Toolbar } from './components/Toolbar'
import { INITIAL_CONTENT } from './constants'
import { plugins } from './plugins'
import { RichTextEditorProps, RichTextEditorRef } from './types'

const editor = createPlateEditor({
  plugins: plugins,
})

export const RichTextEditor = forwardRef<RichTextEditorRef | undefined, RichTextEditorProps>(
  ({ id, defaultValue = INITIAL_CONTENT, onChange }, ref) => {
    const theme = useTheme()
    const { resetEditor, setValue: setEditorValue } = usePlateActions(id)

    const setValue = useCallback(
      (nodes: TNode[]) => {
        setEditorValue(nodes, id)
        resetEditor(id)
      },
      [id, resetEditor, setEditorValue]
    )

    const deserializeHtml = useCallback((html: string) => {
      return plateDeserializeHtml(editor, { element: html })
    }, [])

    const serializeHtml = useCallback((nodes: TNode[]) => {
      return plateSerializeHtml(editor, { nodes })
    }, [])

    useImperativeHandle(ref, () => ({
      setValue,
      deserializeHtml,
      serializeHtml,
    }))

    const editableProps: EditableProps = {
      id,
      autoCapitalize: 'off',
      autoComplete: 'off',
      autoCorrect: 'off',
      spellCheck: false,
      placeholder: 'คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?',
      style: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
        border: `1px solid ${theme.palette.divider}`,
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
      },
    }

    return (
      <HighlightHTML>
        <Plate id={id} editableProps={editableProps} initialValue={defaultValue} onChange={onChange} plugins={plugins}>
          <Toolbar id={id} />
        </Plate>
      </HighlightHTML>
    )
  }
)
