import { ListItemButton, ListItemText, Typography } from '@mui/material'
import Link from 'next/link'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  return (
    <Link
      href={url}
      passHref
      style={{
        textDecoration: 'none',
        width: '100%',
        color: '#6B7280',
        fontWeight: 'bold',
        backgroundColor: 'white',
        borderBottom: '0.5px solid #D1D5DB',
      }}
    >
      <ListItemButton sx={{ padding: '20px 0px 20px 40px', margin: 'auto' }}>
        <Typography sx={{ textAlign: 'left', fontSize: '16px', fontWeight: 700 }}>
          {title}
        </Typography>
      </ListItemButton>
    </Link>
  )
}
