import { NextSeo, NextSeoProps } from 'next-seo'

type PageMetaProps = NextSeoProps

export function PageMeta(props: PageMetaProps) {
  return <NextSeo titleTemplate="%s | CU Get Reg" {...props} />
}
