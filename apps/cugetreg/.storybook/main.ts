import type { StorybookConfig } from '@storybook/sveltekit';
import type { UserConfig } from 'vite';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { searchForWorkspaceRoot } from 'vite';

function getAbsolutePath(value: string): string {
    return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
    stories: [
        '../src/**/*.mdx',
        '../src/**/*.stories.@(js|ts|svelte)',
    ],
    addons: [
        getAbsolutePath('@storybook/addon-svelte-csf'),
        getAbsolutePath('@chromatic-com/storybook'),
        getAbsolutePath('@storybook/addon-vitest'),
        getAbsolutePath('@storybook/addon-a11y'),
        getAbsolutePath('@storybook/addon-docs'),
        getAbsolutePath('@storybook/addon-styling-webpack'),
    ],
    framework: getAbsolutePath('@storybook/sveltekit'),
    staticDirs: ['../static'],
    viteFinal: async (config: UserConfig) => {
        if (config.server && config.server.fs) {
            config.server.fs.allow = [
                searchForWorkspaceRoot(process.cwd()),
            ];
        }
        return config;
    },
};

export default config;
