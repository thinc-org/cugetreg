import { gql, useQuery } from '@apollo/client'
import { Card } from '@material-ui/core'

import { Error } from '@/components/Error'
import { Loading } from '@/modules/CourseSearch/component/Loading'

export const GET_FILMS = gql`
  {
    allFilms {
      films {
        title
      }
    }
  }
`

export interface FilmsData {
  allFilms: {
    films: {
      title: string
    }[]
  }
}

export default function StarWar() {
  const { loading, error, data } = useQuery<FilmsData>(GET_FILMS)

  if (loading) return <Loading loading={loading} />
  if (error) return <Error message={error.message} />

  return (
    <Card>
      <ul>
        {data?.allFilms.films.map((f) => (
          <li key={f.title}>{f.title}</li>
        ))}
      </ul>
    </Card>
  )
}
