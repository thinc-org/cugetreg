import type { StorybookConfig } from '@storybook/sveltekit';
import type { UserConfig } from 'vite';
import { searchForWorkspaceRoot } from 'vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/sveltekit',
    options: {},
  },
  staticDirs: ['../static'],
  viteFinal: async (config: UserConfig) => {
    if (config.server?.fs) {
      config.server.fs.allow = [searchForWorkspaceRoot(process.cwd())];
    }
    return config;
  },
};

export default config;
