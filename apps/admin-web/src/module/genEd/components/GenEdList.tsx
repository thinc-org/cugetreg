import { Override, useGetOverridesQuery } from '@cgr/codegen'

import SingleGenEd from './SingleGenEd'

export function GenEdList() {
  const { data, loading, error, refetch: refetchOverrides } = useGetOverridesQuery()

  if (loading) return null

  return (
    <div>
      {data?.overrides.map((course: Override) => {
        return (
          <SingleGenEd
            key={`${course.courseNo}${course.semester}${course.studyProgram}`}
            course={course}
            refetchOverrides={refetchOverrides}
          />
        )
      })}
    </div>
  )
}
