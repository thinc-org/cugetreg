import { useEffect } from 'react'
import env from '@/utils/env/macro'

function removeElement(id: string) {
  const element = document.getElementById(id)
  element?.parentElement?.removeChild(element)
}

const useApp = () => {
  useEffect(() => {
    removeElement('jss-server-side')
    if (env.features.darkTheme) {
      removeElement('cgr-dark')
    }
  })
}

export default useApp
