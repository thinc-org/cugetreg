import { useTheme } from '@mui/material'
import { Plate, TNode } from '@udecode/plate'
import { EditableProps } from 'slate-react/dist/components/editable'

import React, { useState } from 'react'

import { Toolbar } from './components/Toolbar'
import { INITIAL_CONTENT } from './constants'
import { plugins } from './plugins'
import { RichTextEditorV2Props } from './types'

export const RichTextEditorV2: React.FC<RichTextEditorV2Props> = ({ id, onChange }) => {
  const theme = useTheme()
  const editableProps: EditableProps = {
    id,
    autoCapitalize: 'off',
    autoComplete: 'off',
    autoCorrect: 'off',
    spellCheck: false,
    placeholder: 'Type..',
    style: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  }

  const [debug, setDebug] = useState<TNode[] | null>(null)

  return (
    <Plate
      id={id}
      editableProps={editableProps}
      initialValue={INITIAL_CONTENT}
      onChange={(newValue) => {
        setDebug(newValue)
        onChange?.(newValue)
      }}
      plugins={plugins}
    >
      {JSON.stringify(debug, null, 2)}
      <Toolbar />
    </Plate>
  )
}
