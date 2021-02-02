import { AnnouncementProps } from '@/pages/announcement'
import { useState, useMemo } from 'react'

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
