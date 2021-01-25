import { useCardStyles } from './styles'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface PropTypes {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  body: string
}

export const AnnouncementCard = ({ date, imageURL, title, tags, body }: PropTypes) => {
  const cardStyles = useCardStyles()

  const tag = tags.map((text) => {
    return <Chip key={text} label={text} />
  })

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <div className={cardStyles.root}>
      {imageURL && <img className={cardStyles.image} src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <Typography variant="subtitle1">{dateText}</Typography>
          <Typography variant="h1" component="h2">
            {title}
          </Typography>
        </div>
        <div className={cardStyles.tag}>{tag}</div>
        <p>{body}</p>
      </div>
    </div>
  )
}
