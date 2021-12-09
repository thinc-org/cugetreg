import { useTheme } from '@mui/material'
import { AnyObject, ELEMENT_PARAGRAPH, Plate, TNode } from '@udecode/plate'

import { useState } from 'react'

import { Toolbar } from './components/Toolbar'
import { plugins } from './plugins'
import { RichTextEditorV2Props } from './types'

export const RichTextEditorV2: React.FC<RichTextEditorV2Props> = () => {
  const theme = useTheme()
  const editableProps = {
    placeholder: 'คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?',
    style: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      border: `1px solid ${theme.palette.divider}`,
      borderBottomLeftRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
  }
  const [debugValue, setDebugValue] = useState<TNode<AnyObject>[] | null>(null)

  return (
    <Plate
      editableProps={editableProps}
      initialValue={[{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]}
      onChange={(newValue) => {
        setDebugValue(newValue)
        // save newValue...
      }}
      plugins={plugins}
    >
      value: {JSON.stringify(debugValue)}
      <Toolbar />
    </Plate>
  )
}
