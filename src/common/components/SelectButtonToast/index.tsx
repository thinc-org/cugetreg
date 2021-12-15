import { CustomTypeOptions, useTranslation } from 'react-i18next'

import { ToastAction, ToastLayout, useCurrentToast } from '@/common/components/Toast'
import { Analytics } from '@/common/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@/common/context/Analytics/constants'
import { useShoppingCardModal } from '@/common/context/ShoppingCartModal'

export type ToastTranslationName = keyof CustomTypeOptions['resources']['courseCard']

interface SelectButtonToastProps {
  message: ToastTranslationName
  action: ToastTranslationName
}

export function SelectButtonToast({ message, action }: SelectButtonToastProps) {
  const { t } = useTranslation('courseCard')
  const { onOpen } = useShoppingCardModal()
  const { dismiss } = useCurrentToast()

  return (
    <ToastLayout
      actions={
        <Analytics elementName={SNACKBAR_BUTTON}>
          {({ log }) => (
            <ToastAction
              onClick={() => {
                log(null, message)
                dismiss()
                onOpen()
              }}
            >
              {t(action)}
            </ToastAction>
          )}
        </Analytics>
      }
    >
      {t(message)}
    </ToastLayout>
  )
}
