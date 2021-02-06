import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'
import AnnouncementDetailWrapper from '@/components/AnnouncementDetailWrapper'

import { postFilePaths, POSTS_PATH } from '@/utils/mdxUtils'
import { MdxRemote } from 'next-mdx-remote/types'

interface Props {
  mdxSource: MdxRemote.Source
  metaData: {
    title: string
    updatedTime: string
  }
}

const Post = ({ mdxSource, metaData }: Props) => {
  const content = hydrate(mdxSource)

  return (
    <AnnouncementDetailWrapper data={{ title: metaData.title, updatedTime: metaData.updatedTime }}>
      {content}
    </AnnouncementDetailWrapper>
  )
}

export default Post

export async function getStaticProps({ params }: any) {
  console.log(params.slug)
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)
  const { content, data } = matter(source)
  const mdxSource = await renderToString(content)
  return {
    props: {
      mdxSource,
      metaData: data,
    },
  }
}

export const getStaticPaths = async () => {
  const paths = postFilePaths.map((path) => path.replace(/\.mdx?$/, '')).map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
