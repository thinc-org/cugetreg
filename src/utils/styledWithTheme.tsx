import { makeStyles, Theme } from '@material-ui/core'
import type { ClassNameMap, CSSProperties } from '@material-ui/styles'
import type { ComponentProps, ComponentType, ElementType } from 'react'

type CSSPropertiesCallback = (theme: Theme) => CSSProperties
type StyledWithThemeRules = CSSProperties | CSSPropertiesCallback

type AllProps<Component extends ElementType> = JSX.LibraryManagedAttributes<Component, ComponentProps<Component>>
type StyledProps<Component extends ElementType> = Omit<AllProps<Component>, 'className'> & { className?: string }

function createStyled<Component extends ElementType>(
  Component: Component,
  styles: StyledWithThemeRules
): ComponentType<StyledProps<Component>> {
  let useStyles: () => ClassNameMap<'root'>
  if (typeof styles === 'function') {
    useStyles = makeStyles((theme) => ({ root: styles(theme) }))
  } else {
    useStyles = makeStyles({ root: styles })
  }
  return function Styled({ className, ...props }) {
    const { root } = useStyles()
    return <Component {...(props as AllProps<Component>)} className={`${root}${className ? ` ${className}` : ''}`} />
  }
}

/**
 * Create a new component with a style attached to it
 * Usage: const StyledComponent = styled(Component)(styles)
 *
 * @param Component the base component
 * @param styles the styles to apply. can be CSSProperties or (theme: Theme) => CSSProperties
 */
export function styledWithTheme<Component extends ElementType>(Component: Component) {
  return (styles: StyledWithThemeRules) => createStyled(Component, styles)
}
