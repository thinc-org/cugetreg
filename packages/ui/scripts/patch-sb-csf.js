/* eslint-disable no-undef */

import fs from 'node:fs/promises'

const patchLocation = './node_modules/@storybook/addon-svelte-csf/package.json'

const pkgJson = await fs.readFile(patchLocation, 'utf8')
const pkg = JSON.parse(pkgJson)

if (!pkg.main || !pkg.types) {
  console.log('Patching Storybook Svelte CSF package.json')
  pkg.main = './dist/index.js'
  pkg.types = './dist/index.d.ts'
  await fs.writeFile(patchLocation, JSON.stringify(pkg, null, 2))
}
