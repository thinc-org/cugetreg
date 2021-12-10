import { useTheme } from '@mui/material'
import { Plate } from '@udecode/plate'
import { EditableProps } from 'slate-react/dist/components/editable'

import React from 'react'

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
    <Plate
      id={id}
      editableProps={editableProps}
      initialValue={INITIAL_CONTENT}
      onChange={(val) => {
        console.log(JSON.stringify(val, null, 2))
        onChange?.(val)
      }}
      plugins={plugins}
    >
      <Toolbar />
    </Plate>
  )
}
