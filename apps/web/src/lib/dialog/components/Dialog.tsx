import {
  Dialog as MuiDialog,
  DialogActions as MuiDialogActions,
  DialogContent as MuiDialogContent,
  DialogTitle as MuiDialogTitle,
  Typography as MuiTypography,
  Stack,
  Theme,
  css,
  styled,
} from '@mui/material'

import { Button } from '@libs/react-ui'

import { DialogOptions, useDialog } from '../core'

const dialogStyle = (theme: Theme) => css`
  padding: ${theme.spacing(4)};
  max-width: 400px;
`

const StyledMuiDialogTitle = styled(MuiDialogTitle)`
  ${({ theme }) => dialogStyle(theme)}
`

const StyledMuiDialogContent = styled(MuiDialogContent)`
  ${({ theme }) => dialogStyle(theme)}
  min-height: 80px;
  display: flex;
  align-items: center;
  padding-bottom: 0;
`

const StyledMuiDialogActions = styled(MuiDialogActions)`
  ${({ theme }) => dialogStyle(theme)}
`

export const Dialog: React.FC<DialogOptions> = (props) => {
  const { dialogs, handlers } = useDialog(props)

  const topDialogProps = dialogs[0]

  if (!topDialogProps) return null

  const {
    heading,
    content,
    primaryButtonText,
    secondaryButtonText,
    primaryButtonProps,
    secondaryButtonProps,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
  } = topDialogProps

  const handleClose = () => {
    handlers.close(topDialogProps.id)
  }

  const handleSecondaryClick = () => {
    onSecondaryButtonClick?.()
    handleClose()
  }

  const handlePrimaryClick = () => {
    onPrimaryButtonClick?.()
    handleClose()
  }

  return (
    <MuiDialog open={true} onClose={handleClose}>
      {heading && (
        <StyledMuiDialogTitle>
          <MuiTypography variant="h3" align="center">
            {heading}
          </MuiTypography>
        </StyledMuiDialogTitle>
      )}
      {content && (
        <StyledMuiDialogContent>
          <MuiTypography variant="body2" align="center" sx={{ width: '100%' }}>
            {content}
          </MuiTypography>
        </StyledMuiDialogContent>
      )}
      {(primaryButtonText || secondaryButtonText) && (
        <StyledMuiDialogActions>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            {secondaryButtonText && (
              <Button
                onClick={handleSecondaryClick}
                variant="outlined"
                fullWidth
                {...primaryButtonProps}
              >
                {secondaryButtonText}
              </Button>
            )}
            {primaryButtonText && (
              <Button
                onClick={handlePrimaryClick}
                variant="contained"
                fullWidth
                {...secondaryButtonProps}
              >
                {primaryButtonText}
              </Button>
            )}
          </Stack>
        </StyledMuiDialogActions>
      )}
    </MuiDialog>
  )
}
