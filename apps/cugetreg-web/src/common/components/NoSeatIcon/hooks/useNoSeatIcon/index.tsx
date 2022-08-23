import { MouseEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLog } from '@web/common/context/Analytics/hooks/useLog'

export function useNoSeatIcon() {
  const { t } = useTranslation('regWarNotice') // 1
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const open = Boolean(anchorEl)

  const { log } = useLog('regwarnotice')

  const onHover = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget)
    log(null, 'see notice')
  }

  const onLeave = () => {
    setAnchorEl(null)
  }

  const containerRef = useRef(null)

  return { anchorEl, onHover, onLeave, t, open, containerRef }
}
