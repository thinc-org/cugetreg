// Release Configuration For [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration)
module.exports = {
  branches: [
    {
      name: 'master',
    },
    {
      // TODO: remove this line
      name: 'release',
      prerelease: true,
    },
  ],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        parserOpts: { noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'] },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: { noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'] },
        writerOpts: { commitsSort: ['subject', 'scope'] },
      },
    ],
    ['@semantic-release/changelog', { changelogFile: 'docs/CHANGELOG.md' }],
    ['@semantic-release/git', { assets: ['docs/CHANGELOG.md'] }],
  ],
}
