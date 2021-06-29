import { Analytics } from '@/context/analytics/components/Analytics'
import { LOGIN_BUTTON } from '@/context/analytics/components/const'
import { NavBarItem } from '@/components/TopBar/NavBar/NavBarItem'
import { useTranslation } from 'react-i18next'

export function SigninButton(renderProps: any) {
  const { t } = useTranslation('navBar')
  return (
    <Analytics elementName={LOGIN_BUTTON}>
      {({ log }) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onClick, ...props } = renderProps
        return (
          <NavBarItem
            onClick={() => {
              renderProps.onClick()
              log()
            }}
            {...props}
          >
            {t('signin')}
          </NavBarItem>
        )
      }}
    </Analytics>
  )
}
