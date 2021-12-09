import { IconButton } from '@mui/material'
import {
  getPluginType as getPlatePluginType,
  usePlateEditorRef,
  PlateEditor,
  MarkToolbarButton,
  BlockToolbarButton,
  ListToolbarButton,
} from '@udecode/plate'

import { IconType } from 'react-icons'
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

import { RichTextBlockType, RichTextMarkType } from '../../types'
import { StyledHeadingToolbar, ToolbarButtonWrapper, VerticalDivider } from './styled'

export const Toolbar = () => {
  const editor = usePlateEditorRef()

  const getPluginType = (editor: PlateEditor<{}> | undefined, type: RichTextBlockType | RichTextMarkType): string => {
    return getPlatePluginType(editor as PlateEditor<{}>, type)
  }

  const withIconButton = (Component: IconType, onClick?: () => void) => {
    return (
      <IconButton size="small" disableRipple onClick={onClick}>
        <Component fontSize="0.9em" />
      </IconButton>
    )
  }

  return (
    <ToolbarButtonWrapper>
      <StyledHeadingToolbar>
        <MarkToolbarButton type={getPluginType(editor, RichTextMarkType.BOLD)} icon={withIconButton(MdFormatBold)} />
        <MarkToolbarButton
          type={getPluginType(editor, RichTextMarkType.ITALIC)}
          icon={withIconButton(MdFormatItalic)}
        />
        <MarkToolbarButton
          type={getPluginType(editor, RichTextMarkType.UNDERLINE)}
          icon={withIconButton(MdFormatUnderlined)}
        />
        <MarkToolbarButton
          type={getPluginType(editor, RichTextMarkType.STRIKETHROUGH)}
          icon={withIconButton(MdStrikethroughS)}
        />
        <MarkToolbarButton type={getPluginType(editor, RichTextMarkType.CODE)} icon={withIconButton(MdCode)} />
        <VerticalDivider />
        <BlockToolbarButton type={getPluginType(editor, RichTextBlockType.H1)} icon={withIconButton(CgFormatHeading)} />
        <BlockToolbarButton
          type={getPluginType(editor, RichTextBlockType.BLOCK_QUOTE)}
          icon={withIconButton(MdFormatQuote)}
        />
        <BlockToolbarButton type={getPluginType(editor, RichTextBlockType.CODE_BLOCK)} icon={withIconButton(MdCode)} />
        <ListToolbarButton
          type={getPluginType(editor, RichTextBlockType.ORDER_LIST)}
          icon={withIconButton(MdFormatListNumberedRtl)}
        />
        <ListToolbarButton
          type={getPluginType(editor, RichTextBlockType.UNORDER_LIST)}
          icon={withIconButton(MdFormatListBulleted)}
        />

        <Spacer />
        {withIconButton(MdUndo, () => editor?.undo())}
        {withIconButton(MdRedo, () => editor?.redo())}
      </StyledHeadingToolbar>
    </ToolbarButtonWrapper>
  )
}
