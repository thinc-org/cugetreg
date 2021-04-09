import { Button, ButtonProps, CircularProgress, styled } from '@material-ui/core'

export interface CustomButtonProps extends ButtonProps {
  loading: boolean
}

const Layout = styled('div')({
  position: 'relative',
})

const ContentContainer = styled('div')({
  opacity: 0,
})

const LoadingContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export function CustomButton({ loading, disabled, children, ...rest }: CustomButtonProps) {
  return (
    <Button disabled={loading || disabled} {...rest}>
      {loading ? (
        <Layout>
          <ContentContainer>{children}</ContentContainer>
          <LoadingContainer>
            <CircularProgress size={18} />
          </LoadingContainer>
        </Layout>
      ) : (
        children
      )}
    </Button>
  )
}
