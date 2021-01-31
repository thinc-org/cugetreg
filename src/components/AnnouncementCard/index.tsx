import { AnnouncementContainer, Image, TagContainer, DateTitle, Tag } from './styles'
import Chip from '@/components/Chip'
import GenEdChip from '@/components/GenEdChip'
import { Typography, useTheme, Theme } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { IMAGE_SIZE } from './const'
import { GenEd } from '@/utils/types'

export interface AnnouncementCardPropTypes {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  genEds: GenEd[]
  body: string
}

const AnnouncementCard = ({ date, imageURL, title, tags, genEds, body }: AnnouncementCardPropTypes) => {
  const theme = useTheme<Theme>()

  const CHIP_BG = theme.palette.primary.light
  const CHIP_TEXT = theme.palette.secondary.contrastText

  const tagComponent = tags.map((text) => (
    <Tag key={text}>
      <Chip category={text} backgroundColor={CHIP_BG} textColor={CHIP_TEXT} />
    </Tag>
  ))

  const genedsComponents = genEds.map((genEd) => (
    <Tag key={genEd}>
      <GenEdChip category={genEd} />
    </Tag>
  ))

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
          {tagComponent} {genedsComponents}
        </TagContainer>
        <Typography variant="body1" component="p">
          {body}
        </Typography>
      </div>
    </AnnouncementContainer>
  )
}

export default AnnouncementCard
