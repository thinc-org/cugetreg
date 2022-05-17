import Image from 'next/image'
import { IGetPlaiceholderReturn } from 'plaiceholder'

import { CMS_URL } from '@/env'
import { AnnouncementComponentArticleMedia } from '@/services/apollo/types/announcement'

export interface MediaContentProps extends AnnouncementComponentArticleMedia {
  img: IGetPlaiceholderReturn['img']
  base64: string
}

export const MediaContent: React.FC<MediaContentProps> = ({ media, base64 }) => {
  return (
    <div>
      <Image
        src={`${CMS_URL}${media.url}`}
        width={media.width}
        height={media.height}
        layout="responsive"
        objectFit="cover"
        placeholder="blur"
        blurDataURL={base64}
      />
    </div>
  )
}
