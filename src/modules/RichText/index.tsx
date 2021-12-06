import { createEditor, Descendant } from 'slate'
import { Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact, Editable } from 'slate-react'

import { useState, useRef, useCallback } from 'react'
import { CgFormatHeading } from 'react-icons/cg'
import {
  MdCode,
  MdFileCopy,
  MdFormatBold,
  MdFormatItalic,
  MdFormatListBulleted,
  MdFormatListNumberedRtl,
  MdFormatQuote,
  MdFormatUnderlined,
  MdRedo,
  MdStrikethroughS,
  MdUndo,
} from 'react-icons/md'

import { Spacer } from '@/components/Spacer'

import { IconButton } from './components/IconButton'
import { RichTextElement } from './components/RichTextElement'
import { RichTextLeaf } from './components/RichTextLeaf'
import { Toolbar, StyledEditable, VerticalDivider } from './styled'
import {
  RichTextEditorProps,
  RichTextFormatType,
  RichTextElementType,
  RichTextActionType,
  RichTextRendererProps,
} from './types'

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ onChange }) => {
  /**
   * Workaround for Slate's editor bug: https://stackoverflow.com/a/67126823
   */
  const editorRef = useRef<Editor>()
  if (!editorRef.current) editorRef.current = withHistory(withReact(createEditor()))
  const editor = editorRef.current

  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])

  const renderElement = useCallback((props) => <RichTextElement {...props} />, [])
  const renderLeaf = useCallback((props) => <RichTextLeaf {...props} />, [])

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue)
    onChange(JSON.stringify(newValue))
  }

  return (
    <Slate editor={editor} value={value} onChange={handleChange}>
      <Toolbar>
        <IconButton format={RichTextFormatType.BOLD} icon={MdFormatBold} />
        <IconButton format={RichTextFormatType.ITALIC} icon={MdFormatItalic} />
        <IconButton format={RichTextFormatType.UNDERLINE} icon={MdFormatUnderlined} />
        <IconButton format={RichTextFormatType.STRIKETHROUGH} icon={MdStrikethroughS} />
        <IconButton format={RichTextFormatType.CODE} icon={MdCode} />
        <VerticalDivider />
        <IconButton format={RichTextElementType.HEADING} icon={CgFormatHeading} />
        <IconButton format={RichTextElementType.SUB_HEADING} icon={CgFormatHeading} />
        <IconButton format={RichTextElementType.ORDER_LIST} icon={MdFormatListBulleted} />
        <IconButton format={RichTextElementType.UNORDER_LIST} icon={MdFormatListNumberedRtl} />
        <VerticalDivider />
        <IconButton format={RichTextElementType.BLOCK_QUOTE} icon={MdFormatQuote} />
        <Spacer />
        <IconButton format={RichTextActionType.UNDO} icon={MdUndo} />
        <IconButton format={RichTextActionType.REDO} icon={MdRedo} />
        <IconButton format={RichTextActionType.COPY} icon={MdFileCopy} />
      </Toolbar>
      <StyledEditable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="คุณคิดว่าวิชานี้เป็นอย่างไรบ้าง?"
      />
    </Slate>
  )
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({ value }) => {
  /**
   * Workaround for Slate's editor bug: https://stackoverflow.com/a/67126823
   */
  const editorRef = useRef<Editor>()
  if (!editorRef.current) editorRef.current = withHistory(withReact(createEditor()))
  const editor = editorRef.current

  const renderElement = useCallback((props) => <RichTextElement {...props} />, [])
  const renderLeaf = useCallback((props) => <RichTextLeaf {...props} />, [])

  return (
    <Slate editor={editor} value={JSON.parse(value)} onChange={() => {}}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} readOnly />
    </Slate>
  )
}
