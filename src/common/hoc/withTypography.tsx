import { Typography, TypographyProps } from '@mui/material'

export const withTypography = (Component: React.FC) => {
  const ComponentWithTypoGraphy = (props: TypographyProps) => (
    <Component>
      <Typography {...props} />
    </Component>
  )
  return ComponentWithTypoGraphy
}
