import { AnnouncementContainer, Image, TagContainer, DateTitle, Tag } from './styles'
import Chip from '@/components/Chip'
import { GenEdChip } from '@/components/GenEdChip'
import { Typography } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { IMAGE_SIZE } from './const'
import { ChipShade } from '../Chip/const'
import { GenEdType } from '@thinc-org/chula-courses'
import { isGenEd } from './utils'
import { useTranslation } from 'react-i18next'
import { TagType } from '@/hooks/useAnnouncement/type'

export interface AnnouncementCardPropTypes {
  date: Date
  imageURL: string
  title: string
  tags: TagType[]
  faculties: string[]
  body: string
}

export const AnnouncementCard = ({ date, imageURL, title, tags, faculties, body }: AnnouncementCardPropTypes) => {
  const { t } = useTranslation('announcement')
  const tagComponent = faculties.map((text) => (
    <Tag key={text}>
      <Chip category={text} shade={ChipShade.primaryRange} />
    </Tag>
  ))

  const tagsComponents = tags.map((tag) =>
    isGenEd(tag) ? (
      <Tag key={tag}>
        <GenEdChip category={tag as GenEdType} />
      </Tag>
    ) : (
      <Tag key={tag}>
        <Chip category={t(`category.${tag}` as const)} shade={ChipShade.primaryRange} />
      </Tag>
    )
  )

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <AnnouncementContainer>
      {imageURL && <Image width={IMAGE_SIZE} height={IMAGE_SIZE} src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <DateTitle variant="subtitle1">{dateText}</DateTitle>
          <Typography variant="h6">{title}</Typography>
        </div>
        <TagContainer>
          {tagComponent} {tagsComponents}
        </TagContainer>
        <Typography variant="body1" component="p">
          {body}
        </Typography>
      </div>
    </AnnouncementContainer>
  )
}
