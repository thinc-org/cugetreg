import { makeStyles } from '@material-ui/core'
import { FlexOne } from '@/components/FlexOne'
import { FlexContainer } from '../FlexContainer'
import { ConfigBarItem } from './ConfigBarItem'
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles((theme) => ({
  configBar: {
    width: '100%',
    height: 40,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primaryRange[10],
  },
}))

export function ConfigBar() {
  const { t } = useTranslation('configBar')
  const classes = useStyles()
  return (
    <div className={classes.configBar}>
      <FlexContainer>
        <FlexOne />
        {/* TODO: implement the dropdowns */}
        <ConfigBarItem>นานาชาติ</ConfigBarItem>
        <ConfigBarItem>2563/2</ConfigBarItem>
        <ConfigBarItem>{t('reportAProblem')}</ConfigBarItem>
      </FlexContainer>
    </div>
  )
}
