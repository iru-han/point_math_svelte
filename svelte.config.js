import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path'; // <-- 이 줄을 추가합니다!

const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
    preprocess: vitePreprocess({
        // PostCSS 설정을 추가합니다.
        // 이는 Sass가 Node.js 모듈을 가져올 수 있도록 돕습니다.
        script: true,
        style: true,
        postcss: true, // PostCSS 설정도 유지,
        scss: {
            // additionalData: `@import "@/styles/variables.scss";` // 파일명 확인 (variables.scss)
        }
    }),

    kit: {
        adapter: adapter(),
        alias: { // 이 부분 추가
            '@': path.resolve('./src') // 프로젝트 루트의 src 폴더를 '@'로 설정
        }
    }
};

export default config;
