import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_UL,
  MARK_BOLD,
  MARK_CODE,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  TNode,
} from '@udecode/plate'

export const INITIAL_CONTENT: TNode[] = [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]

/**
 * Mark type
 */
export const RichTextMarkType = {
  BOLD: MARK_BOLD,
  ITALIC: MARK_ITALIC,
  UNDERLINE: MARK_UNDERLINE,
  STRIKETHROUGH: MARK_STRIKETHROUGH,
  CODE: MARK_CODE,
} as const
export type RichTextMarkType = ValueOf<typeof RichTextMarkType>

export const RichTextMarkHotkey: Record<RichTextMarkType, string> = {
  [RichTextMarkType.BOLD]: 'mod+b',
  [RichTextMarkType.ITALIC]: 'mod+i',
  [RichTextMarkType.UNDERLINE]: 'mod+u',
  [RichTextMarkType.STRIKETHROUGH]: 'mod+l',
  [RichTextMarkType.CODE]: 'mod+k',
} as const

export const RichTextMarkTooltip: Record<RichTextMarkType, string> = {
  [RichTextMarkType.BOLD]: `bold <${RichTextMarkHotkey[RichTextMarkType.BOLD]}>`,
  [RichTextMarkType.ITALIC]: `italic <${RichTextMarkHotkey[RichTextMarkType.ITALIC]}>`,
  [RichTextMarkType.UNDERLINE]: `underline <${RichTextMarkHotkey[RichTextMarkType.UNDERLINE]}>`,
  [RichTextMarkType.STRIKETHROUGH]: `strike through <${RichTextMarkHotkey[RichTextMarkType.STRIKETHROUGH]}>`,
  [RichTextMarkType.CODE]: `code <${RichTextMarkHotkey[RichTextMarkType.CODE]}>`,
} as const
export type RichTextMarkTooltip = ValueOf<typeof RichTextMarkTooltip>

/**
 * Block type
 */
export const RichTextBlockType = {
  PARAGRAPH: ELEMENT_PARAGRAPH,
  H1: ELEMENT_H1,
  BLOCK_QUOTE: ELEMENT_BLOCKQUOTE,
  ORDER_LIST: ELEMENT_OL,
  UNORDER_LIST: ELEMENT_UL,
} as const
export type RichTextBlockType = ValueOf<typeof RichTextBlockType>

export const RichTextBlockHotkey: Record<RichTextBlockType, string> = {
  [RichTextBlockType.PARAGRAPH]: 'mod+opt+0',
  [RichTextBlockType.H1]: 'mod+opt+1',
  [RichTextBlockType.BLOCK_QUOTE]: 'mod+opt+.',
  [RichTextBlockType.ORDER_LIST]: '',
  [RichTextBlockType.UNORDER_LIST]: '',
} as const

export const RichTextBlockTooltip: Record<RichTextBlockType, string> = {
  [RichTextBlockType.PARAGRAPH]: `paragraph <${RichTextBlockHotkey[RichTextBlockType.PARAGRAPH]}>`,
  [RichTextBlockType.H1]: `h1 <${RichTextBlockHotkey[RichTextBlockType.H1]}>`,
  [RichTextBlockType.BLOCK_QUOTE]: `blockquote <${RichTextBlockHotkey[RichTextBlockType.BLOCK_QUOTE]}>`,
  [RichTextBlockType.ORDER_LIST]: `ordered list <${RichTextBlockHotkey[RichTextBlockType.ORDER_LIST]}>`,
  [RichTextBlockType.UNORDER_LIST]: `unordered list <${RichTextBlockHotkey[RichTextBlockType.UNORDER_LIST]}>`,
} as const
export type RichTextBlockTooltip = ValueOf<typeof RichTextBlockTooltip>

/**
 * Action type
 */
export const RichTextActionType = {
  UNDO: 'undo',
  REDO: 'redo',
} as const
export type RichTextActionType = ValueOf<typeof RichTextActionType>

export const RichTextActionHotkey: Record<RichTextActionType, string> = {
  [RichTextActionType.UNDO]: 'ctrl+z',
  [RichTextActionType.REDO]: 'ctrl+shift+z',
} as const
export type RichTextActionHotkey = ValueOf<typeof RichTextActionHotkey>

export const RichTextActionTooltip: Record<RichTextActionType, string> = {
  [RichTextActionType.UNDO]: `undo <${RichTextActionHotkey[RichTextActionType.UNDO]}>`,
  [RichTextActionType.REDO]: `redo <${RichTextActionHotkey[RichTextActionType.REDO]}>`,
}

/**
 * All tooltips
 */
export const RichTextTooltip: Record<RichTextMarkType | RichTextBlockType | RichTextActionType, string> = {
  ...RichTextMarkTooltip,
  ...RichTextBlockTooltip,
  ...RichTextActionTooltip,
} as const
