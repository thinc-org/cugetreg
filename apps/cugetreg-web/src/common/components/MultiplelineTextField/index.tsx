import { TextField, styled } from '@mui/material'

export const MultiplelineTextField = styled(TextField)`
  & > div {
    min-height: 120px;
    display: flex;
    align-items: flex-start;
  }
`

MultiplelineTextField.defaultProps = {
  multiline: true,
}
