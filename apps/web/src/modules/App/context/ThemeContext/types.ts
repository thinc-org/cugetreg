export type ThemeProviderProps = React.PropsWithChildren<{ forceDark?: boolean }>

export type ThemeType = 'Light' | 'Dark'

export type IThemeContext = {
  type: ThemeType
  toggleType: () => void
}
