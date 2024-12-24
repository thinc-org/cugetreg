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
}

// Recursive all files in addonPath that match *.js
/**
 * @param {string} file
 */
async function fixImport(file) {
  const content = await fs.readFile(file, 'utf8')

  for (const pattern in replacePatterns) {
    if (content.includes(pattern)) {
      const lengthLimit = 70 - pattern.length

      console.log(
        `Fixing pattern "${pattern}" in ${file.length > lengthLimit ? '...' + file.slice(-lengthLimit) : file}`,
      )
      await fs.writeFile(
        file,
        content.replace(pattern, replacePatterns[pattern]),
      )
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
