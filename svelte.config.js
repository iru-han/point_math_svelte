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
        paths: { // GitHub Pages에 배포할 때 중요한 부분!
            base: process.env.NODE_ENV === 'production' ? '/point_math_svelte' : '', // 프로덕션 환경에서만 기본 경로 설정
                                                                               // '당신의-저장소-이름'을 실제 GitHub 저장소 이름으로 변경
        },
        alias: {
            '@': path.resolve('./src')
        },
        prerender: { // <-- 이 부분 추가!
            // 'default'는 모든 HTTP 오류를 에러로 처리하고 빌드를 중단합니다.
            // 'continue'로 설정하면 404, 500 같은 오류가 발생해도 빌드를 계속 진행합니다.
            // GitHub Pages의 base path 문제에서는 'continue'가 도움이 됩니다.
            entries: [], // <-- 이 부분을 '/'로 수정합니다!
            // 만약 특정 경로만 프리렌더링하고 싶다면 `entries`를 사용할 수 있습니다.
            // entries: ['/', '/about', '/contact']
        }
    },
};

export default config;
