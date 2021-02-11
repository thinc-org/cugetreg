import { GENEDS } from '@/utils/const'

import { Announcement } from './'

export const ALL_FACULTIES = 'all_faculties'
export const ALL_CATEGORIES = 'all_catagories'

export const FACULTIES = [ALL_FACULTIES, 'Faculty 2', 'Faculty 3']
export const CATAGORIES = [ALL_CATEGORIES, 'open', 'close', 'chula', 'other'].concat(GENEDS)

export const mockAnnouncements: Announcement[] = [
  {
    _id: '123',
    title: 'สวัสดี',
    description: 'wefwef',
    content: 'wefew',
    date: new Date(),
    tags: ['open', 'chula', 'HU'],
    faculties: ['Faculty 2', 'Faculty 3'],
    thumbnail: '',
  },
  {
    _id: '12d3',
    title: 'wefwasdef',
    description: 'weasdfwef',
    content: 'wasdefew',
    date: new Date(),
    tags: ['other'],
    faculties: ['Faculty 2'],
    thumbnail: '',
  },
  {
    _id: '1233',
    title: 'wefasdasdwef',
    description: 'asdwefwef',
    content: 'Hello my name is norapat',
    date: new Date(),
    tags: ['SC'],
    faculties: ['Faculty 3'],
    thumbnail: '',
  },
]
