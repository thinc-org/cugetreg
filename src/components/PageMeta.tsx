import { NextSeo, NextSeoProps } from 'next-seo'

interface PageMetaProps extends NextSeoProps {}

export function PageMeta(props: PageMetaProps) {
  return <NextSeo titleTemplate="%s | CU Get Reg" {...props} />
}
