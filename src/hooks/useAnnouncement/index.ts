import { OnSubmit } from '@/components/AnnouncementSearch'
import { useState } from 'react'

import { FACULTIES, CATAGORIES, mockAnnouncements, fuse } from './const'

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'
import { ALL_CATEGORIES, ALL_FACULTIES } from '@/utils/const'
import { TagType } from './type'
import { Faculty } from '@/utils/type'

export interface Announcement {
  _id: string
  title: string
  description: string
  content: string
  date: Date
  tags: TagType[]
  faculties: Faculty[]
  thumbnail: string
}

const useAnnouncement = () => {
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>(mockAnnouncements)

  const search: OnSubmit = (keyword, date, category, faculty) => {
    let filtered = mockAnnouncements

    if (keyword.length !== 0) {
      filtered = fuse.search(keyword).map((item) => item.item)
    }

    filtered = filtered.filter((announcement) => {
      const dateMatch = date === null || differenceInCalendarDays(announcement.date, date) === 0
      const categoryMatch = category == ALL_CATEGORIES || announcement.tags.includes(category)
      const facultyMatch = faculty == ALL_FACULTIES || announcement.faculties.includes(faculty)
      return dateMatch && categoryMatch && facultyMatch
    })

    setFilteredAnnouncements(filtered)
  }

  return { announcements: filteredAnnouncements, search, categories: CATAGORIES, faculties: FACULTIES }
}

export default useAnnouncement
