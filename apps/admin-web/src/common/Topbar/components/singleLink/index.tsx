import { ListItemButton, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  const router = useRouter()

  console.log(router.pathname)
  const isSelected = router.pathname === url

  return (
    <Link
      href={url}
      passHref
      style={{
        textDecoration: 'none',
        width: '100%',
        color: isSelected ? '#FFFFFF' : '#6B7280',
        fontWeight: 'bold',
        backgroundColor: isSelected ? '#6B7280' : '#FFFFFF',
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
