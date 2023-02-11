import { Override, useGetOverridesQuery } from '@cgr/codegen'
import SingleGenEd from './singleGenEd'

export default function GenEdList() {
  const overridesQuery = useGetOverridesQuery()
  console.log(overridesQuery)
  return (
    <section>
      {overridesQuery.data?.overrides &&
        overridesQuery.data?.overrides.map((data: Override) => <SingleGenEd data={data} />)}
    </section>
  )
}
