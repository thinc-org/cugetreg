import { BoxContainer, Image, useStyles } from './styles'
import Chip from '@/components/Chip'
import GenEdChip from '@/components/GenEdChip'
import { Typography, Box, useTheme } from '@material-ui/core'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { BACKGROUND_COLOR, BOX_BORDER_RADIUS, IMAGE_SIZE, TAG_INNER_MARGIN, TAG_VERTICAL_MARGIN } from './const'
import { ThemeType } from '@/configs/theme'

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
  const theme = useTheme<ThemeType>()

  const CHIP_BG = theme.palette.primary.light
  const CHIP_TEXT = theme.palette.secondary.contrastText
  const GENED_CHIP_COLOR = theme.palette.secondaryRange['900']

  const tagComponent = tags.map((text) => (
    <Box key={text} mr={TAG_INNER_MARGIN}>
      <Chip category={text} backgroundColor={CHIP_BG} textColor={CHIP_TEXT} />
    </Box>
  ))

  const genedsComponents = geneds.map((text) => (
    <Box key={text} mr={TAG_INNER_MARGIN}>
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
        <Box display="flex" my={TAG_VERTICAL_MARGIN}>
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
