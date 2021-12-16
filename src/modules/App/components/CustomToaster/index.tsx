import { ClassNames, css, Theme, useTheme } from '@emotion/react'

import { Toaster } from 'react-hot-toast'

import { ToastContextProvider } from '@/common/components/Toast'

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
