import { CourseSearchContext } from '@/context/CourseSearch'
import { createRef, useContext } from 'react'

export const useSearchField = () => {
  const inputRef = createRef<HTMLInputElement>()
  const { refetch } = useContext(CourseSearchContext)

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = inputRef.current?.value
    refetch()
  }

  return { inputRef, onSubmit }
}
