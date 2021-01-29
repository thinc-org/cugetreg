import CourseLabel from '@/components/ShoppingPanel/CourseLabel.tsx'
import { Meta } from '@storybook/react/types-6-0'
import { ThemeProvider, Box } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'

export default {
  title: 'Component/CourseLabel',
  component: CourseLabel,
} as Meta

export const BasicSampleComponent = () => (
  <ThemeProvider theme={lightTheme}>
    <Box display="flex">
      <CourseLabel color="red" category="Humanities" />
    </Box>
  </ThemeProvider>
)
