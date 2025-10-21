import '@repo/ui/css';

// todo viewport addon

import type { Preview } from '@storybook/sveltekit';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
