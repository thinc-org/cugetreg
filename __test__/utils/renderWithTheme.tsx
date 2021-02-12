import React, { ReactElement } from 'react'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { render } from '@testing-library/react'
import { lightTheme } from '@/configs/theme'

import { ThemeProvider } from '@material-ui/core'

const renderWithTheme = (ui: ReactElement) => {
  return render(
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <ThemeProvider theme={lightTheme}>{ui}</ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

export default renderWithTheme
