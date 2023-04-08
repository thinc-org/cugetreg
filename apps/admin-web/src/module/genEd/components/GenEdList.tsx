import { ApolloQueryResult } from '@apollo/client'

import { Exact, GetOverridesQuery, Override } from '@cgr/codegen'

import SingleGenEd from './SingleGenEd'

interface GenEdListProps {
  data: GetOverridesQuery | undefined
  loading: boolean
  refetchOverrides: (
    variables?:
      | Partial<
          Exact<{
            [key: string]: never
          }>
        >
      | undefined
  ) => Promise<ApolloQueryResult<GetOverridesQuery>>
}

export function GenEdList({ data, loading, refetchOverrides }: GenEdListProps) {
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
