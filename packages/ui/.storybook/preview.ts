import type { Preview } from '@storybook/sveltekit'
import "../src/lib/app.css"

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
