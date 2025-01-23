import { dirname, join } from 'node:path'

import type { StorybookConfig } from '@storybook/svelte-vite'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    // '../src/**/*.stories.@(js|jsx|ts|tsx|svelte)',
    '../../../packages/ui/src/components/**/*.stories.@(js|jsx|ts|tsx|svelte)',
  ],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-a11y'),
    '@storybook/addon-svelte-csf',
  ],
  framework: {
    name: getAbsolutePath('@storybook/svelte-vite'),
    options: {},
  },
}

export default config
