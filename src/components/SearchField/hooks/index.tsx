import { createRef, useRef } from 'react'

export const useSearchField = () => {
  const inputRef = createRef<HTMLInputElement>()

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = inputRef.current?.value
    console.log(input)
  }

  return { inputRef, onSubmit }
}
