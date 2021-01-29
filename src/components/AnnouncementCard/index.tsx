import { BoxContainer, Image, useStyles } from './styles'
import Chip from '@/components/Chip'
import GenEdChip from '@/components/GenEdChip'
import { Typography, Box, useTheme, Theme } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { BACKGROUND_COLOR, BOX_BORDER_RADIUS, IMAGE_SIZE, TAG_INNER_MARGIN, TAG_VERTICAL_MARGIN } from './const'
import { GenEd } from '@/utils/types'

export interface AnnouncementCardPropTypes {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  geneds: GenEd[]
  body: string
}

const AnnouncementCard = ({ date, imageURL, title, tags, geneds, body }: AnnouncementCardPropTypes) => {
  const styles = useStyles()
  const theme = useTheme<Theme>()

  const CHIP_BG = theme.palette.primary.light
  const CHIP_TEXT = theme.palette.secondary.contrastText

  const tagComponent = tags.map((text) => (
    <Box key={text} mr={TAG_INNER_MARGIN}>
      <Chip category={text} backgroundColor={CHIP_BG} textColor={CHIP_TEXT} />
    </Box>
  ))

  const genedsComponents = geneds.map((gened) => (
    <Box key={gened} mr={TAG_INNER_MARGIN}>
      <GenEdChip category={gened} />
    </Box>
  ))

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <BoxContainer borderRadius={BOX_BORDER_RADIUS} bgcolor={BACKGROUND_COLOR} display="flex" height={IMAGE_SIZE}>
      {imageURL && <Image width={IMAGE_SIZE} height={IMAGE_SIZE} src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <Typography variant="subtitle1" className={styles.date}>
            {dateText}
          </Typography>
          <Typography variant="h6">{title}</Typography>
        </div>
        <Box display="flex" my={TAG_VERTICAL_MARGIN}>
          {tagComponent} {genedsComponents}
        </Box>
        <Typography variant="body1" component="p">
          {body}
        </Typography>
      </div>
    </BoxContainer>
  )
}

export default AnnouncementCard
