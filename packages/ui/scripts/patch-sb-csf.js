/* eslint-disable no-undef */

import fs from 'node:fs/promises'

const addonPath = './node_modules/@storybook/addon-svelte-csf'
const patchLocation = addonPath + '/package.json'

const pkgJson = await fs.readFile(patchLocation, 'utf8')
const pkg = JSON.parse(pkgJson)

if (!pkg.main || !pkg.types) {
  console.log('Patching Storybook Svelte CSF package.json')
  pkg.main = './dist/index.js'
  pkg.types = './dist/index.d.ts'
  await fs.writeFile(patchLocation, JSON.stringify(pkg, null, 2))
}

// ! Temporary Solution
// Patch broken import
// See: https://github.com/storybookjs/addon-svelte-csf/issues/252

const replacePatterns = {
  "utils/identifier-utils'": "utils/identifier-utils.js'",
  "from '@storybook/node-logger'": "from 'storybook/internal/node-logger'",
  "/replace-argument'": "/replace-argument.js'",
  "/define-meta'": "/define-meta.js'",
  "/parser/ast'": "/parser/ast.js'",
}

// Recursive all files in addonPath that match *.js
/**
 * @param {string} file
 */
async function fixImport(file) {
  let content = await fs.readFile(file, 'utf8')
  let replaced = false

  for (const pattern in replacePatterns) {
    if (content.includes(pattern)) {
      replaced = true

      const lengthLimit = 70 - pattern.length

      console.log(
        `Fixing pattern "${pattern}" in ${file.length > lengthLimit ? '...' + file.slice(-lengthLimit) : file}`,
      )

      content = content.replaceAll(pattern, replacePatterns[pattern])
    }
  }

  if (replaced) {
    await fs.writeFile(file, content)
  }

  for (const line of content.split('\n')) {
    if (line.startsWith('import')) {
      const match = line.match(/from '(.*)'/)

      if (!match) {
        continue
      }

      const importPath = match[1]
      if (
        importPath.startsWith('.') &&
        !(importPath.endsWith('.js') || importPath.endsWith('.svelte'))
      ) {
        console.log(`Warn: ${file}`)
        console.log(`Invalid Import: ${importPath}`)
      }
    }
  }
}

/**
 * @param {string} dir
 */
async function walkDir(dir) {
  const files = await fs.readdir(dir)

  for (const file of files) {
    // If is directory recursive
    if ((await fs.stat(dir + '/' + file)).isDirectory()) {
      await walkDir(dir + '/' + file)
    } else {
      if (file.endsWith('.js')) {
        await fixImport(dir + '/' + file)
      }
    }
  }
}

await walkDir(addonPath)
