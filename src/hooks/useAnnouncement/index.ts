import { OnSubmit } from '@/components/AnnouncementSearch'
import { useState } from 'react'
import Fuse from 'fuse.js'
import { FACULTIES, CATAGORIES, mockAnnouncements } from './const'

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
    let filtered = mockAnnouncements.filter((announcement) => {
      const dateMatch = date === null || differenceInCalendarDays(announcement.date, date) === 0
      const categoryMatch = category == ALL_CATEGORIES || announcement.tags.includes(category)
      const facultyMatch = faculty == ALL_FACULTIES || announcement.faculties.includes(faculty)
      return dateMatch && categoryMatch && facultyMatch
    })

    if (keyword.length !== 0) {
      const options = {
        keys: ['title', 'description', 'content'],
      }
      const fuse = new Fuse(filtered, options)
      filtered = fuse.search(keyword).map((item) => item.item)
    }

    setFilteredAnnouncements(filtered)
  }

  return { announcements: filteredAnnouncements, search, categories: CATAGORIES, faculties: FACULTIES }
}

export default useAnnouncement
