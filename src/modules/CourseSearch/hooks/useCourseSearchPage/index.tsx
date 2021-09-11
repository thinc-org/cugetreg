import { useContext, useState } from 'react'

import { ShoppingCartModalContext } from '@/common/context/ShoppingCartModal'

export const useCourseSearchPage = () => {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { onOpen } = useContext(ShoppingCartModalContext)

  const toggleFilterBar = () => {
    setOpenFilterBar((open) => !open)
  }

  const handleCloseFilterBar = () => {
    setOpenFilterBar(false)
  }

  return { openFilterBar, toggleFilterBar, onOpen, handleCloseFilterBar }
}
