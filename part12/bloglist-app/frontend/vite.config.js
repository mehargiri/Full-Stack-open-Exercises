import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './testSetup.js',
	},
	server: {
		proxy: {
			'/api': {
				target: process.env.E2E
					? 'http://localhost:3001'
					: 'http://localhost:8080',
				changeOrigin: true,
			},
		},
	},
});
