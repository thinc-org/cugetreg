import { Typography } from '@mui/material'

import { LinkType } from '../../linkConstant'
import SingleLink from '../singleLink'
import { StyledList, StyledListItem } from './styled'

interface SectionLinkProps {
  links: LinkType[]
  sectionTitle: string
}

export default function SectionLink({ links, sectionTitle }: SectionLinkProps) {
  return (
    <StyledList sx={{ width: '240px' }}>
      <Typography fontWeight={700} fontSize={'24px'} sx={{ padding: '14px 0px 14px 24px' }}>
        {sectionTitle}
      </Typography>
      <StyledListItem disablePadding>
        {links.map((link) => (
          <SingleLink key={link.url} title={link.title} url={link.url} />
        ))}
      </StyledListItem>
    </StyledList>
  )
}
