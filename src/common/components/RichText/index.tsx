import { createEditor, Descendant } from 'slate'
import { Editor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact, Editable } from 'slate-react'

import { useRef, useCallback } from 'react'
import { CgFormatHeading } from 'react-icons/cg'
import {
  MdCode,
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
import { serializer } from './serializer'
import { Toolbar, StyledEditable, VerticalDivider } from './styled'
import {
  RichTextEditorProps,
  RichTextMarkType,
  RichTextBlockType,
  RichTextActionType,
  RichTextRendererProps,
} from './types'

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  /**
   * Workaround for Slate's editor bug: https://stackoverflow.com/a/67126823
   */
  const editorRef = useRef<Editor>()
  if (!editorRef.current) editorRef.current = withHistory(withReact(createEditor()))
  const editor = editorRef.current

  const renderElement = useCallback((props) => <RichTextElement {...props} />, [])
  const renderLeaf = useCallback((props) => <RichTextLeaf {...props} />, [])

  const handleChange = (newValue: Descendant[]) => {
    onChange(serializer.serialize(newValue))
    // const sel = serializer.serialize(newValue)
    // console.log('serialize', sel)
    // const delsel = serializer.deserialize(sel.split('\n').join(''))
    // console.log('deserialize', JSON.stringify(delsel, null, 2))
  }

  return (
    <Slate editor={editor} value={serializer.deserialize(value)} onChange={handleChange}>
      <Toolbar>
        <IconButton format={RichTextMarkType.BOLD} icon={MdFormatBold} />
        <IconButton format={RichTextMarkType.ITALIC} icon={MdFormatItalic} />
        <IconButton format={RichTextMarkType.UNDERLINE} icon={MdFormatUnderlined} />
        <IconButton format={RichTextMarkType.STRIKETHROUGH} icon={MdStrikethroughS} />
        <IconButton format={RichTextMarkType.CODE} icon={MdCode} />
        <VerticalDivider />
        <IconButton format={RichTextBlockType.HEADING} icon={CgFormatHeading} />
        <IconButton format={RichTextBlockType.SUB_HEADING} icon={CgFormatHeading} />
        <IconButton format={RichTextBlockType.UNORDER_LIST} icon={MdFormatListBulleted} />
        <IconButton format={RichTextBlockType.ORDER_LIST} icon={MdFormatListNumberedRtl} />
        <IconButton format={RichTextBlockType.BLOCK_QUOTE} icon={MdFormatQuote} />
        <Spacer />
        <IconButton format={RichTextActionType.UNDO} icon={MdUndo} />
        <IconButton format={RichTextActionType.REDO} icon={MdRedo} />
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
    <Slate editor={editor} value={serializer.deserialize(value)} onChange={() => {}}>
      <Editable renderElement={renderElement} renderLeaf={renderLeaf} readOnly />
    </Slate>
  )
}
