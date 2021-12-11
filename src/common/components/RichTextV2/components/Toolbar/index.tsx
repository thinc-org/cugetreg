import { CgFormatHeading } from 'react-icons/cg'
import {
  MdCode,
  MdFormatBold,
  MdFormatItalic,
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

export const Toolbar: React.FC<{ id: string }> = ({ id }) => {
  return (
    <StyledHeadingToolbar>
      <ToolbarButton id={id} mode="mark" type={RichTextMarkType.BOLD} icon={MdFormatBold} />
      <ToolbarButton id={id} mode="mark" type={RichTextMarkType.ITALIC} icon={MdFormatItalic} />
      <ToolbarButton id={id} mode="mark" type={RichTextMarkType.UNDERLINE} icon={MdFormatUnderlined} />
      <ToolbarButton id={id} mode="mark" type={RichTextMarkType.STRIKETHROUGH} icon={MdStrikethroughS} />
      <ToolbarButton id={id} mode="mark" type={RichTextMarkType.CODE} icon={MdCode} />
      <VerticalDivider />
      <ToolbarButton id={id} mode="block" type={RichTextBlockType.H1} icon={CgFormatHeading} />
      <ToolbarButton id={id} mode="block" type={RichTextBlockType.BLOCK_QUOTE} icon={MdFormatQuote} />
      {/** Temporary hide because of bug https://github.com/udecode/plate/issues/1300 */}
      {/* <ToolbarButton id={id} mode="list" type={RichTextBlockType.ORDER_LIST} icon={MdFormatListNumberedRtl} />
      <ToolbarButton id={id} mode="list" type={RichTextBlockType.UNORDER_LIST} icon={MdFormatListBulleted} /> */}
      <Spacer />
      <ToolbarButton id={id} mode="none" type={RichTextActionType.UNDO} icon={MdUndo} />
      <ToolbarButton id={id} mode="none" type={RichTextActionType.REDO} icon={MdRedo} />
    </StyledHeadingToolbar>
  )
}
