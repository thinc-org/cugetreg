import { IconButton, Tooltip, Popover, Typography, Link, Card, Container } from '@material-ui/core'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline'
import { values } from 'lodash'
import { MouseEventHandler, useCallback } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLog } from '@/context/analytics/components/useLog'

function NoSeatIcon() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('regWarNotice')
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [more, setMore] = useState(false)

  const { log } = useLog('regwarnotice')

  const onClick = (e: any) => {
    setAnchorEl(e.currentTarget)
    setOpen(true)
    log(null, 'see notice')
  }

  const onClose = () => {
    setAnchorEl(null)
    setOpen(false)
    setMore(false)
  }

  return (
    <>
      <Tooltip title={t('reason')}>
        <IconButton onClick={onClick}>
          <HelpOutlineIcon />
        </IconButton>
      </Tooltip>
      <Popover open={open} onClose={onClose} anchorEl={anchorEl}>
        <Container maxWidth="sm">
          <Typography variant="body1" padding="1em">
            <p>{t('notice')}</p>
            {!more && (
              <Link
                onClick={() => {
                  log(null, 'see more notice')
                  setMore(true)
                }}
              >
                {t('more')}
              </Link>
            )}
            {more && <p>{t('morenotice')}</p>}
          </Typography>
        </Container>
      </Popover>
    </>
  )
}

export default NoSeatIcon
