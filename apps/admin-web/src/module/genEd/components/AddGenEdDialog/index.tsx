import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { ButtonContainer, DialogContainer } from './styled'

interface AddGenEdDialogProps {
  setOpenAddGenEdDialog: Dispatch<SetStateAction<boolean>>
}

const REGEX = /^[0-9]*$/

// TODO: Add transiton when render
// TODO: Fix the bug that has delay when open
export default function AddGenEdDialog({ setOpenAddGenEdDialog }: AddGenEdDialogProps) {
  const [courseNo, setCourseNo] = useState<string>('')
  const [isFirstInput, setIsFirstInput] = useState<boolean>(true)
  console.log('Render AddGenEdDialog')
  const handleAdd = async () => {
    // TODO: Add API
    // TODO: Add toast

    setOpenAddGenEdDialog(false)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setIsFirstInput(false)

    // Validate input here
    const isValidInput = REGEX.test(newValue)

    if (isValidInput) {
      setCourseNo(newValue)
    }
  }

  const isError = !isFirstInput && (courseNo.length !== 7 || !REGEX.test(courseNo))

  return (
    <DialogContainer>
      <Typography fontWeight={700}>Enter The Course Number To Add New Course</Typography>
      <TextField
        sx={{ background: 'white' }}
        placeholder="Enter the course number here..."
        aria-placeholder="Enter the course number here"
        inputProps={{
          inputMode: 'numeric',
          pattern: '[0-9]*',
          minLength: 7,
          maxLength: 7,
        }}
        onChange={handleChange}
        value={courseNo}
        error={isError}
        helperText={isError ? 'Input must be a 7-digit number' : null}
      />
      <ButtonContainer>
        <Button variant="contained" sx={{ width: '240px' }} onClick={handleAdd}>
          Add
        </Button>
        <Button
          variant="outlined"
          sx={{ width: '240px' }}
          onClick={() => setOpenAddGenEdDialog(false)}
        >
          Cancel
        </Button>
      </ButtonContainer>
    </DialogContainer>
  )
}
