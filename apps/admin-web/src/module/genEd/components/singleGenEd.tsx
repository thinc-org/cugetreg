import { Override } from '@cgr/codegen'

interface SingleGenEdProps {
  data: Override
}

export default function SingleGenEd({ data }: SingleGenEdProps) {
  return <h1>{data.courseNo}</h1>
}
