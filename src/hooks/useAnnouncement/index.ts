import { Announcement } from '@/pages/announcement'
import { useState, useMemo } from 'react'

const useAnnouncement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const search = () => {
    // searchKeyword
    console.log('search')
    const mockResult: Announcement[] = []
    setAnnouncements(mockResult)
  }

  const filteredAnnouncements = useMemo(() => {
    return announcements
  }, [announcements])

  return { announcements: filteredAnnouncements, search }
}

export default useAnnouncement
