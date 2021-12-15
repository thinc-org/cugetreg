import { Button } from '@mui/material'

import toast from 'react-hot-toast'
import { CustomTypeOptions, useTranslation } from 'react-i18next'

import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/common/context/Analytics/constants'
import { useShoppingCardModal } from '@/common/context/ShoppingCartModal'

export type ToastTranslationName = keyof CustomTypeOptions['resources']['courseCard']

interface SelectButtonToastProps {
  toastId: string
  message: ToastTranslationName
  action: ToastTranslationName
}

export function SelectButtonToast({ toastId, message, action }: SelectButtonToastProps) {
  const { t } = useTranslation('courseCard')
  const { onOpen } = useShoppingCardModal()

  return (
    <span style={{ display: 'flex', alignItems: 'center' }}>
      {t(message)}
      <Analytics elementName={SNACKBAR_BUTTON}>
        {({ log }) => (
          <Button
            size="medium"
            sx={{ ml: 1 }}
            onClick={() => {
              log(null, message)
              toast.dismiss(toastId)
              onOpen()
            }}
          >
            {t(action)}
          </Button>
        )}
      </Analytics>
    </span>
  )
}
