import { Toaster } from 'react-hot-toast'

import { ClassNames } from '@emotion/react'
import { Theme, css, useTheme } from '@mui/material'
import { ToastContextProvider } from '@web/common/components/Toast'

import { CustomToastBar } from '../CustomToastBar'

const toastStyles = (theme: Theme) => css`
  top: 20px;
  font-size: 1rem;
  font-family: Prompt;
  border-radius: 4px;
  padding: 0;
  padding-left: 10px;
  border: 1px solid ${theme.palette.divider};
`

export function CustomToaster() {
  const theme = useTheme()

  return (
    <ClassNames>
      {({ css }) => (
        <Toaster
          position="top-center"
          toastOptions={{
            className: css(toastStyles(theme)),
          }}
          gutter={16}
        >
          {(t) => (
            <ToastContextProvider toast={t}>
              <CustomToastBar />
            </ToastContextProvider>
          )}
        </Toaster>
      )}
    </ClassNames>
  )
}
