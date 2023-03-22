import { ListItemButton, ListItemText } from '@mui/material'
import Link from 'next/link'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  return (
    <Link href={url} passHref style={{ textDecoration: 'none', width: '100%', color: 'black' }}>
      <ListItemButton sx={{ padding: '20px 0px 20px 40px', margin: 'auto' }}>
        <ListItemText sx={{ textAlign: 'left', fontSize: '16px' }} primary={title} />
      </ListItemButton>
    </Link>
  )
}
