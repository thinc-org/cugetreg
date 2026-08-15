import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  assetsInclude: ['**/*.md'],
  // isomorphic-dompurify pulls in jsdom (for server-side sanitization), whose
  // css-tree dependency does `require('../data/patch.json')` relative to its
  // own file location. Bundling jsdom into the SSR chunk breaks that relative
  // path, so keep it external and let Node resolve it from node_modules
  // (present at runtime — see apps/cugetreg/Dockerfile's pruned prod deploy).
  ssr: {
    external: ['jsdom'],
    noExternal: ['@cugetreg/utils', '@cugetreg/zod-schemas', '@cugetreg/ui'],
  },
});
