import { ReactNode } from 'react'
import { IconType } from 'react-icons'

import { IconButton, TooltipProps } from '@mui/material'
import { CodeBlockToolbarButton } from '@udecode/plate-code-block-ui'
import {
  PlateEditor,
  getPluginType as getPlatePluginType,
  usePlateEditorRef,
} from '@udecode/plate-core'
import { ListToolbarButton } from '@udecode/plate-list-ui'
import { BlockToolbarButton, MarkToolbarButton } from '@udecode/plate-toolbar'

import { RichTextActionType, RichTextTooltip } from '../../constants'
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

  const getPluginType = (
    editor: PlateEditor<any> | undefined,
    type: ToolbarButtonProps['type']
  ): string => {
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

  const withWrapper = (component: ReactNode) => {
    return (
      <BootstrapTooltip {...tooltipProps}>
        <SpanWrapper>{component}</SpanWrapper>
      </BootstrapTooltip>
    )
  }

  let children: ReactNode = null
  switch (mode) {
    case 'mark':
      children = (
        <MarkToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
      )
      break
    case 'block':
      children = (
        <BlockToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
      )
      break
    case 'code_block':
      children = (
        <CodeBlockToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
      )
      break
    case 'list':
      children = (
        <ListToolbarButton type={getPluginType(editor, type)} icon={withIconButton(icon)} />
      )
      break
    default:
      children = <span>{withIconButton(icon, createOnMouseDown(type))}</span>
      break
  }

  return withWrapper(children)
}
