import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
    // --- 이 부분을 추가합니다! ---
    optimizeDeps: {
        // Vite가 dev 서버 시작 시 미리 번들링하지 않을 모듈을 명시합니다.
        // GSAP을 제외하여 SyntaxError를 피합니다.
        exclude: ['gsap']
    },
    // --- 이 부분을 추가합니다! ---
    ssr: {
        // Node.js 환경에서 ES Modules로 처리해야 할 패키지를 명시합니다.
        // GSAP을 SSR 외부(external)에서 제외하여, Vite가 CommonJS로 변환하지 않도록 합니다.
        // 이는 Svelte 5와 Node.js의 ESM 호환성 문제를 우회하는 데 도움이 됩니다.
        noExternal: ['gsap'] // 'gsap' 및 관련 플러그인 (예: 'gsap/ScrollTrigger') 포함
    }
});
