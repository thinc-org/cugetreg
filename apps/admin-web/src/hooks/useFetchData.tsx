import { useRouter } from 'next/router'

// TODO: explicit function types
export async function useFetchData(f: any) {
  const router = useRouter()
  try {
    const res = await f()
    return res
  } catch (err) {
    console.log(err)
    router.push('/login')
  }
}
