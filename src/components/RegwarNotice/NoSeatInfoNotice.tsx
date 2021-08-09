import { IconButton, Popover, Typography, Container, IconButtonProps } from '@material-ui/core'
import { ErrorOutline } from '@material-ui/icons'
import { MouseEvent, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLog } from '@/context/analytics/components/useLog'

function NoSeatIcon(props: IconButtonProps) {
  const { t } = useTranslation('regWarNotice')
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

  return (
    <>
      <IconButton
        ref={containerRef}
        size="small"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        {...props}
      >
        <ErrorOutline fontSize="inherit" />
      </IconButton>
      <Popover
        open={open}
        onClose={onLeave}
        anchorEl={anchorEl}
        id="mouse-over-popover"
        disableRestoreFocus
        sx={{ pointerEvents: 'none' }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        container={containerRef?.current}
      >
        <Container maxWidth="sm">
          <Typography variant="body1">
            <p>{t('notice')}</p>
          </Typography>
        </Container>
      </Popover>
    </>
  )
}

export default NoSeatIcon
