import styled from '@emotion/styled'
import { Editable } from 'slate-react'

import { RichTextBlockTag, RichTextMarkTag } from '@/common/components/RichText/types'

export const Toolbar = styled.div`
  padding: ${({ theme }) => theme.spacing(1, 2)};
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-top-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-top-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
  flex-wrap: wrap;
`

export const StyledEditable = styled(Editable)`
  min-height: 80px;
  padding: ${({ theme }) => theme.spacing(1, 2)};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-top: none;
  border-bottom-left-radius: ${({ theme }) => theme.shape.borderRadius}px;
  border-bottom-right-radius: ${({ theme }) => theme.shape.borderRadius}px;
`

export const VerticalDivider = styled.div`
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  align-self: stretch;
`

export const Wrapper = styled.div`
  color: ${({ theme }) => theme.palette.primary.main};

  & ${RichTextBlockTag.HEADING} {
    font-size: ${({ theme }) => theme.typography.h5.fontSize};
    line-height: ${({ theme }) => theme.typography.h5.lineHeight}px;
    margin: ${({ theme }) => theme.spacing(1.5, 0)};
  }

  & ${RichTextBlockTag.BLOCK_QUOTE} {
    padding: ${({ theme }) => theme.spacing(0, 1)};
    opacity: 0.65;
    border-left: 0.25em solid rgba(0, 0, 0, 0.1);
    margin: ${({ theme }) => theme.spacing(2)};
  }
  & ${RichTextMarkTag.CODE} {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: ${({ theme }) => theme.shape.borderRadius}px;
    padding: 0.2em 0.4em;
    margin: 0 0.4em;
    font-size: 85%;
  }
  /* & ${RichTextBlockTag.PARAGRAPH} {
  }
  & ${RichTextBlockTag.ORDER_LIST} {
  }
  & ${RichTextBlockTag.UNORDER_LIST} {
  }
  & ${RichTextBlockTag.LIST_ITEM} {
  }
  & ${RichTextMarkTag.BOLD} {
  }
  & ${RichTextMarkTag.ITALIC} {
  }
  & ${RichTextMarkTag.UNDERLINE} {
  }
  & ${RichTextMarkTag.STRIKETHROUGH} {
  } */
`
