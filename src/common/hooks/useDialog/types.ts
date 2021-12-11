import { UniversalDialogProps } from '@/common/components/UniversalDialog/types'

export interface UseDialog {
  activate: (props: Omit<UniversalDialogProps, 'open' | 'setOpen'>) => void
  Dialog: () => JSX.Element
}
