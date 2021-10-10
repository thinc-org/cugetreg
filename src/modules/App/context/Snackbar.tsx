import { SnackbarProvider } from '@/common/context/Snackbar'
import { useSnackBar } from '@/common/hooks/useSnackbar'

interface SnackbarProviderProps {
  children: React.ReactNode
}

export const SnackbarContextProvider = ({ children }: SnackbarProviderProps) => {
  const snackbar = useSnackBar()

  return <SnackbarProvider value={snackbar}>{children}</SnackbarProvider>
}
