import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter()
  },
  vitePlugin: {
    include: [/\/packages\/ui\/dist\/.*\.svelte$/]
  }
};
