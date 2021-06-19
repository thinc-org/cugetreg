import { GenEdType } from '@thinc-org/chula-courses'
import { useState, useMemo } from 'react'

export interface AnnouncementProps {
  date: Date
  imageURL: string
  title: string
  tags: string[]
  genEds: GenEdType[]
  body: string
}

const useAnnouncement = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementProps[]>([])

  const search = () => {
    // searchKeyword
    console.log('search')
    const mockResult: AnnouncementProps[] = []
    setAnnouncements(mockResult)
  }

  const filteredAnnouncements = useMemo(() => {
    return announcements
  }, [announcements])

  return { announcements: filteredAnnouncements, search }
}

export default useAnnouncement
