import { useState } from 'react'

export const useEmpty = () => {
  const [isEmpty, setIsEmpty] = useState(false)
  return { isEmpty, setIsEmpty }
}
