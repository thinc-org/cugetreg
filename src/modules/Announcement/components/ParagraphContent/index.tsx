import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import { useCallback, useEffect, useState } from 'react'

import { AnnouncementComponentArticleParagraph } from '@/services/apollo/types/announcement'

export interface ParagraphContentProps extends AnnouncementComponentArticleParagraph {}

export const ParagraphContent: React.FC<ParagraphContentProps> = ({ text }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [source, setSource] = useState<MDXRemoteSerializeResult>()

  const onSerialize = useCallback(async () => {
    const result = await serialize(text)
    setSource(result)
    setIsLoading(false)
  }, [text])

  useEffect(() => {
    onSerialize()
  }, [onSerialize])

  if (isLoading) return null

  return <MDXRemote {...(source as MDXRemoteSerializeResult)} components={{}} />
}
