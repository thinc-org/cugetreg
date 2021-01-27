import { BoxContainer, Image, Tag } from './styles'
import Chip from '@material-ui/core/Chip'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export interface PropTypes {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  body: string
}

const AnnouncementCard = ({ date, imageURL, title, tags, body }: PropTypes) => {
  const tag = tags.map((text) => {
    return <Chip key={text} label={text} />
  })

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <BoxContainer display="flex">
      {imageURL && <Image src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <Typography variant="subtitle1">{dateText}</Typography>
          <Typography variant="h1" component="h2">
            {title}
          </Typography>
        </div>
        <Tag>{tag}</Tag>
        <p>{body}</p>
      </div>
    </BoxContainer>
  )
}

export default AnnouncementCard
