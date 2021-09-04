import React, { createContext } from 'react'

import { SnackbarProps } from './types'

export const SnackbarContext = createContext({} as SnackbarProps)

export const SnackbarContextProvider = (props: { value: SnackbarProps; children: React.ReactNode }) => {
  return <SnackbarContext.Provider {...props} />
}
