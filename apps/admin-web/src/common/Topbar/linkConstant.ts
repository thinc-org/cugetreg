export interface LinkType {
  title: String
  url: String
}

export interface LinkSectionType {
  [key: string]: LinkType[]
}

export const links: LinkSectionType = {
  Review: [
    { title: 'Pending Reviews', url: '/pendingReviews' },
    { title: 'Approved Reviews', url: '/approvedReviews' },
  ],
  Gened: [{ title: 'All Context', url: '/genEd' }],
}
