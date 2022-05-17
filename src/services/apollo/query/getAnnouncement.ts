import { gql } from '@apollo/client'

import { ANNOUNCEMENT_DATA_FIELDS } from '@/services/apollo/template/announcementDataField'

import { Announcement } from '../types/announcement'

export interface GetAnnouncementVars {
  title?: string
  pin?: boolean
}

export interface GetAnnouncementResponse {
  announcements: Announcement[]
}

export const GET_ANNOUNCEMENT = gql`
  query announcement($title: String, $pin: Boolean) {
    announcements(where: { title: $title, pin: $pin }, sort: "created_at:desc") {
      ${ANNOUNCEMENT_DATA_FIELDS}
    }
  }
`
