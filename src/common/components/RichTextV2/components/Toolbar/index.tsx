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

import { RichTextBlockType, RichTextMarkType, RichTextActionType } from '../../constants'
import { ToolbarButton } from '../ToolbarButton'
import { StyledHeadingToolbar, VerticalDivider } from './styled'

export const Toolbar = () => {
  return (
    <StyledHeadingToolbar>
      <ToolbarButton mode="mark" type={RichTextMarkType.BOLD} icon={MdFormatBold} />
      <ToolbarButton mode="mark" type={RichTextMarkType.ITALIC} icon={MdFormatItalic} />
      <ToolbarButton mode="mark" type={RichTextMarkType.UNDERLINE} icon={MdFormatUnderlined} />
      <ToolbarButton mode="mark" type={RichTextMarkType.STRIKETHROUGH} icon={MdStrikethroughS} />
      <ToolbarButton mode="mark" type={RichTextMarkType.CODE} icon={MdCode} />
      <VerticalDivider />
      <ToolbarButton mode="block" type={RichTextBlockType.H1} icon={CgFormatHeading} />
      <ToolbarButton mode="block" type={RichTextBlockType.BLOCK_QUOTE} icon={MdFormatQuote} />
      <ToolbarButton mode="block" type={RichTextBlockType.CODE_BLOCK} icon={MdCode} />
      <ToolbarButton mode="list" type={RichTextBlockType.ORDER_LIST} icon={MdFormatListNumberedRtl} />
      <ToolbarButton mode="list" type={RichTextBlockType.UNORDER_LIST} icon={MdFormatListBulleted} />
      <Spacer />
      <ToolbarButton mode="none" type={RichTextActionType.UNDO} icon={MdUndo} />
      <ToolbarButton mode="none" type={RichTextActionType.REDO} icon={MdRedo} />
    </StyledHeadingToolbar>
  )
}
