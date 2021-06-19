import { gql, useQuery } from '@apollo/client'
import { Card } from '@material-ui/core'

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

  if (loading) return <p>Loading</p>
  if (error) return <p>`Error ${error.message}`</p>

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
