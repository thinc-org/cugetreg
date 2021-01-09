import { useSampleHook } from '../hooks/useSampleHook'

export default function SampleComponent() {
  const hello = useSampleHook()
  return <>{hello}</>
}
