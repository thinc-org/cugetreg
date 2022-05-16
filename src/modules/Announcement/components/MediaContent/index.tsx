import Image from 'next/image'

import { CMS_URL } from '@/env'
import { AnnouncementComponentArticleMedia } from '@/services/apollo/types/announcement'

export interface MediaContentProps extends AnnouncementComponentArticleMedia {}

export const MediaContent: React.FC<MediaContentProps> = ({ media }) => {
  return (
    <Image
      src={`${CMS_URL}${media.url}`}
      width={media.width}
      height={media.height}
      layout="responsive"
      objectFit="cover"
    />
  )
}
