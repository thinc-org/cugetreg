import path from 'path'
import fs from 'fs'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import hydrate from 'next-mdx-remote/hydrate'

import { postFilePaths, POSTS_PATH } from '@/utils/mdxUtils'
import { MdxRemote } from 'next-mdx-remote/types'

interface Props {
  mdxSource: MdxRemote.Source
}

const Post = ({ mdxSource }: Props) => {
  const content = hydrate(mdxSource)

  return <div>{content}</div>
}

export default Post

export async function getStaticProps({ params }: any) {
  console.log(params.slug)
  const postFilePath = path.join(POSTS_PATH, `${params.slug}.mdx`)
  const source = fs.readFileSync(postFilePath)
  const { content } = matter(source)
  const mdxSource = await renderToString(content)
  return { props: { mdxSource } }
}

export const getStaticPaths = async () => {
  const paths = postFilePaths.map((path) => path.replace(/\.mdx?$/, '')).map((slug) => ({ params: { slug } }))

  return {
    paths,
    fallback: false,
  }
}
