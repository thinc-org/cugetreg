import { makeStyles, Theme } from '@material-ui/core'
import type { ClassNameMap, CSSProperties } from '@material-ui/styles'
import { ComponentProps, ComponentType, ElementType, forwardRef } from 'react'

type CSSPropertiesCallback = (theme: Theme) => CSSProperties
type StyledWithThemeRules = CSSProperties | CSSPropertiesCallback

type AllProps<Component extends ElementType> = JSX.LibraryManagedAttributes<Component, ComponentProps<Component>>
type StyledProps<Component extends ElementType> = Omit<AllProps<Component>, 'className'> & { className?: string }

type StyledComponent<Component extends ElementType> = ComponentType<StyledProps<Component>> & {
  withComponent: <NewComponent extends ElementType>(newComponent: NewComponent) => StyledComponent<NewComponent>
}

function createStyled<Component extends ElementType>(
  Component: Component,
  styles: StyledWithThemeRules
): StyledComponent<Component> {
  let useStyles: () => ClassNameMap<'root'>
  if (typeof styles === 'function') {
    useStyles = makeStyles((theme) => ({ root: styles(theme) }))
  } else {
    useStyles = makeStyles({ root: styles })
  }
  const outputComponent = (forwardRef(function Styled({ className, ...props }: StyledProps<Component>, ref) {
    const { root } = useStyles()
    return (
      <Component
        ref={ref}
        {...(props as AllProps<Component>)}
        className={`${root}${className ? ` ${className}` : ''}`}
      />
    )
  }) as unknown) as StyledComponent<Component>
  outputComponent.withComponent = (newComponent) => createStyled(newComponent, styles)
  return outputComponent
}

/**
 * Create a new component with a style attached to it
 * Usage: const StyledComponent = styled(Component)(styles)
 *
 * @param Component the base component
 * @param styles the styles to apply. can be CSSProperties or (theme: Theme) => CSSProperties
 * @deprecated use emotion instead
 */
export function styledWithTheme<Component extends ElementType>(Component: Component) {
  return (styles: StyledWithThemeRules) => createStyled(Component, styles)
}
