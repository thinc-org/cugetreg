import { Typography } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

import GeneralChip from '@/components/Chips'

import { GeneralChipKey } from '../Chips/config'
import { IMAGE_SIZE } from './const'
import { AnnouncementContainer, Image, TagContainer, DateTitle } from './styles'

export interface AnnouncementCardPropTypes {
  date: Date
  imageURL: string
  title: string
  tags: GeneralChipKey[]
  body: string
}

export const AnnouncementCard = ({ date, imageURL, title, tags, body }: AnnouncementCardPropTypes) => {
  const tagComponent = tags.map((tag) => <GeneralChip key={tag} type={tag} />)

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <AnnouncementContainer>
      {imageURL && <Image width={IMAGE_SIZE} height={IMAGE_SIZE} src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <DateTitle variant="subtitle1">{dateText}</DateTitle>
          <Typography variant="h6">{title}</Typography>
        </div>
        <TagContainer>{tagComponent}</TagContainer>
        <Typography variant="body1" component="p">
          {body}
        </Typography>
      </div>
    </AnnouncementContainer>
  )
}
