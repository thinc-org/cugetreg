import ShoppingPanel from '@/components/ShoppingPanel'
import { ThemeProvider } from '@material-ui/core'
import { lightTheme } from '@/configs/theme'
import { mockData } from './mockData'
import { Meta } from '@storybook/react/types-6-0'

export default {
  title: 'Component/ShoppingPanel',
  component: ShoppingPanel,
} as Meta

export const ShoppingPanelStory = () => (
  <ThemeProvider theme={lightTheme}>
    <ShoppingPanel data={mockData} />
  </ThemeProvider>
)
