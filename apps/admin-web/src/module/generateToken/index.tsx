import { useEffect } from 'react'
import { toast } from 'react-hot-toast'

import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'

import { authApi } from '@admin-web/utils/authAxios'

import { SpinnerContainer } from './styled'

export function GenerateToken() {
  const router = useRouter()

  useEffect(() => {
    if (!router) return

    const { code } = router.query

    const getToken = async () => {
      try {
        if (!code || typeof code !== 'string') {
          throw new Error('Code is not defined or is invalid')
        }

        await authApi.get('/validateCode', {
          params: {
            code,
          },
        })
        router.push('/pendingReviews')
      } catch (err) {
        if (err instanceof Error) toast.error(err.message)
        else toast.error('Unknown error')
      }
    }
    getToken()
  }, [router])

  return (
    <SpinnerContainer>
      <CircularProgress />
    </SpinnerContainer>
  )
}
