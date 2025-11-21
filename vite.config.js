import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
	server: {
		https: true,
		host: true,
	},
	plugins: [vue(), vueDevTools(), mkcert({
        certFileName: 'travel-memories'
    })],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
});
