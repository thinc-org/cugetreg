export interface LinkType {
  title: string
  url: string
}

export interface LinkSectionType {
  [key: string]: LinkType[]
}

export const links: LinkSectionType = {
  Review: [
    { title: 'Review Approval', url: '/pendingReviews' },
    { title: 'All Review', url: '/approvedReviews' },
  ],
  Gened: [{ title: 'All Context', url: '/genEd' }],
}
