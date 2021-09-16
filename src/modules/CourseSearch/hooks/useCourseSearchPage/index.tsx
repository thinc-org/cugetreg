import { useMediaQuery, useTheme } from '@material-ui/core'
import { useContext, useEffect, useState } from 'react'

import { ShoppingCartModalContext } from '@/common/context/ShoppingCartModal'

export const useCourseSearchPage = () => {
  const [openFilterBar, setOpenFilterBar] = useState(false)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('sm'))

  useEffect(() => {
    setOpenFilterBar(isDesktop)
  }, [isDesktop])

  const { onOpen } = useContext(ShoppingCartModalContext)

  const toggleFilterBar = () => {
    setOpenFilterBar((open) => !open)
  }

  const handleCloseFilterBar = () => {
    setOpenFilterBar(false)
  }

  return { openFilterBar, toggleFilterBar, onOpen, handleCloseFilterBar }
}
