import { useTheme } from '@mui/material'
import { Plate } from '@udecode/plate-core'
import { EditableProps } from 'slate-react/dist/components/editable'

import React from 'react'

import { HighlightHTML } from '../HighlightHTML'
import { Toolbar } from './components/Toolbar'
import { INITIAL_CONTENT } from './constants'
import { plugins } from './plugins'
import { RichTextEditorProps } from './types'

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, defaultValue = INITIAL_CONTENT, onChange }) => {
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

  return (
    <HighlightHTML>
      <Plate id={id} editableProps={editableProps} initialValue={defaultValue} onChange={onChange} plugins={plugins}>
        <Toolbar id={id} />
      </Plate>
    </HighlightHTML>
  )
}
