import { Box, BoxProps, styled } from '@material-ui/core'
import { ForwardedRef, forwardRef } from 'react'

export const Spacer = styled('div')({
  flex: 1,
})

export interface FlexProps extends BoxProps {
  direction?: BoxProps['flexDirection']
  align?: BoxProps['alignItems']
  justify?: BoxProps['justifyContent']
  wrap?: BoxProps['flexWrap']
  basis?: BoxProps['flexBasis']
  grow?: BoxProps['flexGrow']
  shrink?: BoxProps['flexShrink']
}

/**
 * @deprecated use MuiStack instead
 */
export const Flex = forwardRef((props: FlexProps, ref: ForwardedRef<'div'>) => {
  const { direction, align, justify, wrap, basis, grow, shrink, ...rest } = props
  const style = {
    display: 'flex',
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap,
    flexBasis: basis,
    flexGrow: grow,
    flexShrink: shrink,
  }
  return <Box ref={ref} {...style} {...rest} />
})
