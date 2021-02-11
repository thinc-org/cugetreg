import { AnnouncementCard } from '@/components/AnnouncementCard'
import useAnnouncement from '@/hooks/useAnnouncement'
import { AnnouncementSearch } from '@/components/AnnouncementSearch'

export default function AnnouncementPage() {
  const { announcements, search, categories, faculties } = useAnnouncement()

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
    <div>
      <AnnouncementSearch categories={categories} faculties={faculties} onSubmit={search} />
      {Announcements}
    </div>
  )
}
