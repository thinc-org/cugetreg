const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4200'

module.exports = {
  siteUrl: siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/server-sitemap.xml`],
  },
  sourceDir: 'dist/apps/web/.next',
  outDir: 'dist/apps/web/public',
}
