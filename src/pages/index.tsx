import SampleComponent from '@/components/SampleComponent'
import { useTranslation } from 'react-i18next'

export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      <h1>{t('appName')}</h1>
      <SampleComponent />
    </>
  )
}
