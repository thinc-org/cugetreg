import { useContext, useState } from 'react'

import { ShoppingCartModalContext } from '@/common/context/ShoppingCartModal'

export const useCourseSearchPage = () => {
  const [openFilterBar, setOpenFilterBar] = useState(false)

  const { onOpen } = useContext(ShoppingCartModalContext)

  return { openFilterBar, setOpenFilterBar, onOpen }
}
