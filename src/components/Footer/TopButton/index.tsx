import { Button, makeStyles } from '@material-ui/core'
import { FlexContainer } from '../FlexContainer'
import chevronUp from '@/assets/images/chevronUp.svg'
import React from 'react'

const useStyles = makeStyles((theme) => ({
  button: {
    ...theme.typography.subtitle1,
    color: theme.palette.primaryRange['100'],
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    padding: '20px 40px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  logo: {
    marginLeft: '16px',
  },
}))

export function TopButton() {
  const classes = useStyles()

  const scrollToTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }

  return (
    <FlexContainer className={classes.buttonContainer}>
      <Button className={classes.button} onClick={scrollToTop}>
        กลับด้านบน
        <a className={classes.logo}>
          <img src={chevronUp} />
        </a>
      </Button>
    </FlexContainer>
  )
}
