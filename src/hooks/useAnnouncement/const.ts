import { category, faculty } from '@/i18n/locales/th'
import { CategorySearchTag, Faculty } from '@/utils/type'
import { Announcement } from '.'

export const FACULTIES = Object.keys(faculty) as Faculty[]
export const CATAGORIES = Object.keys(category) as CategorySearchTag[]

export const mockAnnouncements: Announcement[] = [
  {
    _id: '123',
    title: 'สวัสดี',
    description: 'wefwef',
    content: 'wefew',
    date: new Date(),
    tags: ['open', 'chula', 'HU'],
    faculties: [],
    thumbnail:
      'https://foreignpolicy.com/wp-content/uploads/2020/07/Marine-Thailand-Exercise-GettyImages-1203838332.jpg',
  },
  {
    _id: '12d3',
    title: 'wefwasdef',
    description: 'weasdfwef',
    content: 'wasdefew',
    date: new Date(),
    tags: ['other'],
    faculties: ['key'],
    thumbnail:
      'https://foreignpolicy.com/wp-content/uploads/2020/07/Marine-Thailand-Exercise-GettyImages-1203838332.jpg',
  },
  {
    _id: '1233',
    title: 'wefasdasdwef',
    description: 'asdwefwef',
    content: 'Hello my name is norapat',
    date: new Date(),
    tags: ['SC'],
    faculties: ['key'],
    thumbnail:
      'https://foreignpolicy.com/wp-content/uploads/2020/07/Marine-Thailand-Exercise-GettyImages-1203838332.jpg',
  },
]
