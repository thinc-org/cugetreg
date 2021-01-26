import SampleComponent from '@/components/SampleComponent'
import { useTranslation } from 'react-i18next'
// import SampleComponent from '@/components/SampleComponent'
import ShoppingPanel from '@/components/ShoppingPanel'

export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('appName')}</h1>
      <SampleComponent />
      {/* <h1>CU Get Reg</h1> */}
      {/* <SampleComponent /> */}
      <ShoppingPanel />
    </>
  )
}
