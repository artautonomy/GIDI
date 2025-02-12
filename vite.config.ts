import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	build:{
		target: "esnext", // or "es2019",
	  },
	  esbuild:{
		target: "esnext", // or "es2019",
	  },
	  optimizeDeps:{
		esbuildOptions: {
		  target: "esnext",
		}
	  },
	plugins: [sveltekit()]
});
