const siteUrl = process.env.SITE_URL || 'http://localhost:3000'

module.exports = {
  titleTemplate: '%s | CU Get Reg',
  defaultTitle: 'CU Get Reg',
  description: 'เว็บไซต์เพื่ออำนวยความสะดวกในการลงทะเบียนเรียนให้กับนิสิตจุฬาฯ ทุกคน',
  additionalMetaTags: [
    {
      property: 'keywords',
      content: 'cu,chula,จุฬา,reg,getreg,regchula,ตารางเรียน,ตารางสอน,gened',
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
