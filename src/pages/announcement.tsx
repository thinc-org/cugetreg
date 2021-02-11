import { AnnouncementCard } from '@/components/AnnouncementCard'
import useAnnouncement from '@/hooks/useAnnouncement'
import { AnnouncementSearch } from '@/components/AnnouncementSearch'
import { styledWithTheme } from '@/utils/styledWithTheme'
import { Typography } from '@material-ui/core'
import { useTranslation } from 'react-i18next'

const SearchContainer = styledWithTheme('div')((theme) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(7),
}))

const ResultContainer = styledWithTheme('div')((theme) => ({
  marginRight: theme.spacing(4),
  width: '100%',
}))

const Container = styledWithTheme('div')((theme) => ({
  marginTop: theme.spacing(11),
}))

export default function AnnouncementPage() {
  const { announcements, search, categories, faculties } = useAnnouncement()
  const { t } = useTranslation('announcement')
  const Announcements = announcements.map((announcement) => {
    return (
      <AnnouncementCard
        key={announcement._id}
        date={announcement.date}
        title={announcement.title}
        faculties={announcement.faculties}
        imageURL={announcement.thumbnail}
        tags={announcement.tags}
        body={announcement.description}
      />
    )
  })

  return (
    <Container>
      <Typography variant="h2">{t('mainText')}</Typography>
      <SearchContainer>
        <ResultContainer>{Announcements}</ResultContainer>
        <AnnouncementSearch categories={categories} faculties={faculties} onSubmit={search} />
      </SearchContainer>
    </Container>
  )
}
