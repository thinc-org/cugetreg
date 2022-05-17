import { useQuery } from '@apollo/client'

import { GetAnnouncementResponse, GetAnnouncementVars, GET_ANNOUNCEMENT } from '@/services/apollo/query/getAnnouncement'

export function useCurrentAnnouncement() {
  const { data, loading, error } = useQuery<GetAnnouncementResponse, GetAnnouncementVars>(GET_ANNOUNCEMENT, {
    variables: {
      pin: true,
    },
    context: {
      cms: true,
    },
  })
  return {
    data: data?.announcements?.[0],
    loading,
    error,
  }
}
