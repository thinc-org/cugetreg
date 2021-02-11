import { CategorySearchTag, Faculty } from '@/components/AnnouncementSearch/type'
import { GENEDS } from '@/utils/const'
import { Announcement } from '.'

export const ALL_FACULTIES = 'all_faculties'
export const ALL_CATEGORIES = 'all_catagories'

export const FACULTIES = [ALL_FACULTIES, 'key1', 'key2'] as Faculty[]
export const CATAGORIES = [ALL_CATEGORIES, 'open', 'close', 'chula', 'other'].concat(GENEDS) as CategorySearchTag[]

export const mockAnnouncements: Announcement[] = [
  {
    _id: '123',
    title: 'สวัสดี',
    description: 'wefwef',
    content: 'wefew',
    date: new Date(),
    tags: ['open', 'chula', 'HU'],
    faculties: [],
    thumbnail: '',
  },
  {
    _id: '12d3',
    title: 'wefwasdef',
    description: 'weasdfwef',
    content: 'wasdefew',
    date: new Date(),
    tags: ['other'],
    faculties: ['key'],
    thumbnail: '',
  },
  {
    _id: '1233',
    title: 'wefasdasdwef',
    description: 'asdwefwef',
    content: 'Hello my name is norapat',
    date: new Date(),
    tags: ['SC'],
    faculties: ['key'],
    thumbnail: '',
  },
]
