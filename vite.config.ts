import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	server: {
	  fs: {
		allow: ['.'], // Ensure this is not overly restrictive; it should allow the whole project folder
	  },
	},
  });
