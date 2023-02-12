import { Button, Typography } from '@mui/material'
import Link from 'next/link'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  return (
    <Link href={url} passHref>
      <Button variant="contained">
        <Typography>{title}</Typography>
      </Button>
    </Link>
  )
}
