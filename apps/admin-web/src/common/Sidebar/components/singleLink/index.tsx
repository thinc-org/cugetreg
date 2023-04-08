import { ListItemButton, Typography } from '@mui/material'
import Link from 'next/link'
import { NextRouter, useRouter } from 'next/router'

interface SingleLinkProps {
  title: string
  url: string
}

export default function SingleLink({ title, url }: SingleLinkProps) {
  const router = useRouter()

  const isSelected = isSelectedLink(router, url)

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

function isSelectedLink(router: NextRouter, url: string): boolean {
  if (router.pathname === url) return true
  const genEdRegex = /^\/genEd/
  const isGenEd = genEdRegex.test(router.pathname)
  if (isGenEd) {
    const { slug } = router.query
    if (!slug && url === '/genEd') return true
    if (!!slug && url === `/genEd/${slug[0]}`) return true
  }
  return false
}
