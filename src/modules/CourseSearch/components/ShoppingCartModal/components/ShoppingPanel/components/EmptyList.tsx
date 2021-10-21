import { Stack, Typography } from '@material-ui/core'
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder'
import { useTranslation } from 'react-i18next'

export const EmptyList = () => {
  const { t } = useTranslation('shoppingPanel')
  return (
    <Stack spacing={2} marginTop={4} textAlign="center">
      <div>
        <BookmarkBorderIcon sx={{ fontSize: 150 }} />
      </div>
      <Typography variant="h6" fontSize={30}>
        {t('empty')}
      </Typography>
    </Stack>
  )
}