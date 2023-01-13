import { CustomTypeOptions, useTranslation } from 'react-i18next'

import { Analytics } from '@web/common/context/Analytics/components/Analytics'
import { SNACKBAR_BUTTON } from '@web/common/context/Analytics/constants'
import { useShoppingCardModal } from '@web/common/context/ShoppingCartModal'

import { ToastAction, ToastLayout, useCurrentToast } from '@libs/react-ui'

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
