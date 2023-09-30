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
  Gened: [
    { title: 'All Type', url: '/genEd' },
    { title: 'HU (มนุษย์)', url: '/genEd/hu' },
    { title: 'SCI (วิทย์-คณิต)', url: '/genEd/sci' },
    { title: 'IN (สห)', url: '/genEd/in' },
    { title: 'SOC (สังคม)', url: '/genEd/soc' },
  ],
}

export const loginLink = '/auth/login'

export const generateTokenLink = '/auth/generateToken'
