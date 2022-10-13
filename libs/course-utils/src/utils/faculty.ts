import { faculties } from '../constants'
import { Faculty } from '../types'

export const getFaculty = (code: string): Faculty | undefined => {
  if (!(code in faculties)) return
  const res = faculties[code]
  return { code, ...res }
}
