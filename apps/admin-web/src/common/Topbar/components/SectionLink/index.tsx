import { Typography } from '@mui/material'
import { StyledListItem, StyledList } from './styled'
import { LinkType } from '../../linkConstant'
import SingleLink from '../singleLink'

interface SectionLinkProps {
  links: LinkType[]
  sectionTitle: string
}

export default function SectionLink({ links, sectionTitle }: SectionLinkProps) {
  return (
    <StyledList sx={{ width: '240px' }}>
      <Typography fontWeight={700} fontSize={'24px'} sx={{ padding: '20px 0px 20px 24px' }}>
        {sectionTitle}
      </Typography>
      <StyledListItem disablePadding>
        {links.map((link) => (
          <SingleLink title={link.title} url={link.url} />
        ))}
      </StyledListItem>
    </StyledList>
  )
}
