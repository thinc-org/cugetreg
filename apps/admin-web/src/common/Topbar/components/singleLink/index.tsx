import { Button, Typography } from '@mui/material'
import { StyledButtonLink } from './styled'
import Link from 'next/link'

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
