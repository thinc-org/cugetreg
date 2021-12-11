import { useTheme } from '@mui/material'
import { Plate, TNode } from '@udecode/plate-core'
import { EditableProps } from 'slate-react/dist/components/editable'

import React, { useState } from 'react'

import { HighlightHTML } from '../HighlightHTML'
import { Toolbar } from './components/Toolbar'
import { INITIAL_CONTENT } from './constants'
import { plugins } from './plugins'
import { RichTextEditorV2Props } from './types'

export const RichTextEditorV2: React.FC<RichTextEditorV2Props> = ({ id, defaultValue = INITIAL_CONTENT, onChange }) => {
  const theme = useTheme()
  const [debug, setDebug] = useState<TNode[]>(defaultValue)

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

  return (
    <HighlightHTML>
      <Plate
        id={id}
        editableProps={editableProps}
        initialValue={defaultValue}
        onChange={(newValue) => {
          setDebug(newValue)
          onChange?.(newValue)
        }}
        plugins={plugins}
      >
        {JSON.stringify(debug, null, 2)}
        <Toolbar id={id} />
      </Plate>
    </HighlightHTML>
  )
}
