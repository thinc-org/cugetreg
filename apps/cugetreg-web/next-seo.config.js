const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4200'
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'dev'

const options = {
  titleTemplate: '%s | CU Get Reg',
  defaultTitle: 'CU Get Reg',
  description: 'เว็บไซต์เพื่ออำนวยความสะดวกในการลงทะเบียนเรียนให้กับนิสิตจุฬาฯ ทุกคน',
  dangerouslySetAllPagesToNoIndex: environment !== 'production',
  dangerouslySetAllPagesToNoFollow: environment !== 'production',
  additionalMetaTags: [
    {
      property: 'keywords',
      content: [
        'cu',
        'chula',
        'จุฬา',
        'reg',
        'getreg',
        'regchula',
        'ตารางเรียน',
        'ตารางสอน',
        'gened',
        'CU Get Reg',
        'ลงทะเบียนเรียน',
        'อำนวยความสะดวก',
      ].join(','),
    },
    {
      name: 'application-name',
      content: 'CU Get Reg',
    },
  ],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'CU Get Reg',
    description: 'เว็บไซต์เพื่ออำนวยความสะดวกในการลงทะเบียนเรียนให้กับนิสิตจุฬาฯ ทุกคน',
    images: [
      {
        url: `${siteUrl}/cover.jpg`,
        width: 800,
        height: 600,
        alt: 'CU Get Reg',
      },
    ],
  },
}

module.exports = options
