import { IconButton, TooltipProps } from '@mui/material'
import {
  BlockToolbarButton,
  getPluginType as getPlatePluginType,
  ListToolbarButton,
  MarkToolbarButton,
  CodeBlockToolbarButton,
  PlateEditor,
  usePlateEditorRef,
} from '@udecode/plate'

import { IconType } from 'react-icons'

import { RichTextTooltip, RichTextActionType } from '../../constants'
import { BootstrapTooltip, SpanWrapper } from './styled'
import { ToolbarButtonProps } from './types'

export const ToolbarButton: React.FC<ToolbarButtonProps> = ({ id, mode, type, icon }) => {
  const editor = usePlateEditorRef(id)

  const tooltipProps: Omit<TooltipProps, 'children'> = {
    title: RichTextTooltip[type],
    placement: 'bottom-end',
  }

  const createOnMouseDown = (type: ToolbarButtonProps['type']): (() => void) => {
    if (type === RichTextActionType.UNDO) return () => editor?.undo()
    else if (type === RichTextActionType.REDO) return () => editor?.redo()
    return () => {}
  }

  const getPluginType = (editor: PlateEditor<{}> | undefined, type: ToolbarButtonProps['type']): string => {
    if (!editor) return ''
    return getPlatePluginType(editor, type)
  }

  const withIconButton = (IconComponent: IconType, onMouseDown?: () => void) => {
    return (
      <IconButton size="small" disableRipple onMouseDown={onMouseDown}>
        <IconComponent fontSize="0.9em" />
      </IconButton>
    )
  }

  switch (mode) {
    case 'mark':
      return (
        <BootstrapTooltip {...tooltipProps}>
          <SpanWrapper>
            <MarkToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
          </SpanWrapper>
        </BootstrapTooltip>
      )
    case 'block':
      return (
        <BootstrapTooltip {...tooltipProps}>
          <SpanWrapper>
            <BlockToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
          </SpanWrapper>
        </BootstrapTooltip>
      )
    case 'code_block':
      return (
        <BootstrapTooltip {...tooltipProps}>
          <SpanWrapper>
            <CodeBlockToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
          </SpanWrapper>
        </BootstrapTooltip>
      )
    case 'list':
      return (
        <BootstrapTooltip {...tooltipProps}>
          <SpanWrapper>
            <ListToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
          </SpanWrapper>
        </BootstrapTooltip>
      )
    default:
      return <BootstrapTooltip {...tooltipProps}>{withIconButton(icon, createOnMouseDown(type))}</BootstrapTooltip>
  }
}
