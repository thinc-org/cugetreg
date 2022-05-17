import { gql } from '@apollo/client'

import { ANNOUNCEMENT_DATA_FIELDS } from '@/services/apollo/template/announcementDataField'

import { Announcement } from '../types/announcement'

export type AnnouncementComponentType = 'ComponentArticleRichText' | 'ComponentArticleMediaParagraph'

export interface GetAllAnnouncementsVars {
  limit: number
  start: number
}

export interface GetAllAnnouncementsResponse {
  announcements: Announcement[]
  announcementsConnection: {
    aggregate: {
      totalCount: number
    }
  }
}

export const GET_ALL_ANNOUNCEMENTS = gql`
  query announcement($limit: Int!, $start: Int!) {
    announcements(limit: $limit, start: $start) {
      ${ANNOUNCEMENT_DATA_FIELDS}
    }
    announcementsConnection {
      aggregate {
        totalCount
      }
    }
  }
`
