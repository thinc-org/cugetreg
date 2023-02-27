import { Typography } from '@mui/material'
import Link from 'next/link'

import { StyledButtonLink } from './styled'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  return (
    <Link href={url} passHref style={{ textDecoration: 'none' }}>
      <StyledButtonLink>
        <Typography>{title}</Typography>
      </StyledButtonLink>
    </Link>
  )
}
