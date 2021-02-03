import { makeStyles, Theme } from '@material-ui/core'
import type { ClassNameMap, CSSProperties } from '@material-ui/styles'
import type { ComponentProps, ComponentType, ElementType } from 'react'

type CSSPropertiesCallback = (theme: Theme) => CSSProperties
type StyledWithThemeRules = CSSProperties | CSSPropertiesCallback

type StyledProps<Component> = Omit<ComponentProps<Component>, 'className'> & { className?: string }

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
  return function Styled({ className, ...props }: StyledProps<Component>) {
    const { root } = useStyles()
    return <Component {...props} className={`${root}${className ? ` ${className}` : ''}`} />
  }
}

export function styledWithTheme<Component extends ElementType>(Component: Component) {
  return (styles: StyledWithThemeRules) => createStyled(Component, styles)
}
