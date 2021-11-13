import { Typography, TypographyProps } from '@material-ui/core'

export const withTypography = (Component: React.FC) => {
  const ComponentWithTypoGraphy = (props: TypographyProps) => (
    <Component>
      <Typography {...props} />
    </Component>
  )
  return ComponentWithTypoGraphy
}
