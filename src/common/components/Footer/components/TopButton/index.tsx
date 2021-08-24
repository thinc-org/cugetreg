import { Button, makeStyles, useMediaQuery, useTheme } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'

import chevronUp from '@/assets/images/chevronUp.svg'

import { FlexContainer } from '../../styled'

const useStyles = makeStyles((theme) => ({
  button: {
    ...theme.typography.subtitle1,
    color: theme.palette.primaryRange['100'],
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2.5, 5),
    },
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2.5, 1.5),
    },
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    marginLeft: theme.spacing(2),
  },
}))

export function TopButton() {
  const { t } = useTranslation()
  const theme = useTheme()
  const classes = useStyles()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }

  return (
    <FlexContainer className={classes.buttonContainer}>
      <Button className={classes.button} onClick={scrollToTop}>
        {matches && t('footer:topButton')}
        <a className={classes.logo}>
          <img src={chevronUp} />
        </a>
      </Button>
    </FlexContainer>
  )
}
