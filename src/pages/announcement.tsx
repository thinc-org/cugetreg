import { AnnouncementCard } from '@/components/AnnouncementCard'
import useAnnouncement from '@/hooks/useAnnouncement'
import { GenEdType } from '@thinc-org/chula-courses'

export interface AnnouncementProps {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  genEds: GenEdType[]
  body: string
}

export default function AnnouncementPage() {
  //   const { announcements, search, searchKeyword, searchDate, searchCategory, searchFaculty } = useAnnouncement()

  //   const Announcements = announcements.map((announcement) => {
  //     return <AnnouncementCard />
  //   })

  //   return <div>{Announcements}</div>
  return <div></div>
}
