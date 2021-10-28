import { IconButton, Popover, Typography, Container, IconButtonProps } from '@material-ui/core'
import { ErrorOutline } from '@material-ui/icons'

import { useNoSeatIcon } from './hooks/useNoSeatIcon'

export function NoSeatIcon(props: IconButtonProps) {
  const { anchorEl, onHover, onLeave, t, open, containerRef } = useNoSeatIcon()
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
