const noteTransform = (commit, context) => {
  let discard = true
  const issues = []
  const url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl
  const issueUrl = `${url}/issues/`

  // For debugging
  // console.log('commit', commit)

  if (commit.mergeId) {
    commit.subject = `${commit.subject} (#${commit.mergeId})`
  }

  commit.notes.forEach((note) => {
    note.title = 'BREAKING CHANGES'
    discard = false
  })

  if (commit.type === 'feat') {
    commit.type = 'Features'
  } else if (commit.type === 'fix') {
    commit.type = 'Bug Fixes'
  } else if (commit.type === 'perf') {
    commit.type = 'Performance Improvements'
  } else if (commit.type === 'revert' || commit.revert) {
    commit.type = 'Reverts'
  } else if (discard) {
    return
  } else if (commit.type === 'docs') {
    commit.type = 'Documentation'
  } else if (commit.type === 'style') {
    commit.type = 'Styles'
  } else if (commit.type === 'refactor') {
    commit.type = 'Code Refactoring'
  } else if (commit.type === 'test') {
    commit.type = 'Tests'
  } else if (commit.type === 'build') {
    commit.type = 'Build System'
  } else if (commit.type === 'ci') {
    commit.type = 'Continuous Integration'
  }

  if (commit.scope === '*') {
    commit.scope = ''
  }

  if (typeof commit.hash === 'string') {
    commit.shortHash = commit.hash.substring(0, 7)
  }

  if (typeof commit.subject === 'string') {
    if (url) {
      // Issue URLs.
      commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
        issues.push(issue)
        return `[#${issue}](${issueUrl}${issue})`
      })
    }
    if (context.host) {
      // User URLs.
      commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
        if (username.includes('/')) {
          return `@${username}`
        }

        return `[@${username}](${context.host}/${username})`
      })
    }
  }

  // remove references that already appear in the subject
  commit.references = commit.references.filter((reference) => {
    return issues.indexOf(reference.issue) === -1
  })

  return commit
}

// Release Configuration For [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration)

module.exports = {
  branches: [{ name: 'main' }],
  plugins: [
    '@semantic-release/commit-analyzer',
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'angular',
        parserOpts: {
          mergePattern: /^Merge pull request #(\d+) from (.*)$/,
          mergeCorrespondence: ['mergeId', 'source'],
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        writerOpts: {
          groupBy: 'type',
          commitGroupsSort: 'title',
          commitsSort: ['scope', 'subject'],
          noteGroupsSort: 'title',
          transform: noteTransform,
        },
      },
    ],
    ['@semantic-release/changelog', { changelogFile: 'docs/CHANGELOG.md' }],
    ['@semantic-release/github', { assets: ['docs/CHANGELOG.md'] }],
    ['@semantic-release/git', { assets: ['docs/CHANGELOG.md'] }],
  ],
}
