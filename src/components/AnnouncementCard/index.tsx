import { BoxContainer, Image, useStyles } from './styles'
import Chip from '@/components/Chip'
import GenEdChip from '@/components/GenEdChip'
import { Typography, Box } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { BACKGROUND_COLOR, BOX_BORDER_RADIUS, CHIP_BG, CHIP_TEXT, GENED_CHIP_COLOR, IMAGE_SIZE } from './const'

export interface PropTypes {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  geneds: string[]
  body: string
}

const AnnouncementCard = ({ date, imageURL, title, tags, geneds, body }: PropTypes) => {
  const styles = useStyles()

  const tagComponent = tags.map((text) => (
    <Box key={text} mr={2}>
      <Chip category={text} backgroundColor={CHIP_BG} textColor={CHIP_TEXT} />
    </Box>
  ))

  const genedsComponents = geneds.map((text) => (
    <Box key={text} mr={2}>
      <GenEdChip category={text} color={GENED_CHIP_COLOR} />
    </Box>
  ))

  const dateText = format(date, 'dd/mm/yyyy hh:mm', { locale: th })

  return (
    <BoxContainer borderRadius={BOX_BORDER_RADIUS} bgcolor={BACKGROUND_COLOR} display="flex" height={IMAGE_SIZE}>
      {imageURL && <Image width={IMAGE_SIZE} height={IMAGE_SIZE} src={imageURL} alt="announcement Image" />}
      <div>
        <div>
          <Typography key="subtitle1" variant="subtitle1" className={styles.date}>
            {dateText}
          </Typography>
          <Typography key="h6" variant="h6">
            {title}
          </Typography>
        </div>
        <Box display="flex" my={3}>
          {tagComponent} {genedsComponents}
        </Box>
        <Typography key="body1" variant="body1" component="p">
          {body}
        </Typography>
      </div>
    </BoxContainer>
  )
}

export default AnnouncementCard
