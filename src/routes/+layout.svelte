<script lang="ts">
    import '../app.css'; // 전역 CSS 임포트

    import { onMount, onDestroy } from 'svelte';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    // SvelteKit의 page store는 $app/state에서 임포트합니다.
    import { page } from '$app/state'; // <-- Svelte 5 권장 경로로 수정

    // 로고 이미지 임포트: 정확한 경로와 파일명으로 수정 (assets/logo.png로 가정)
    import LogoImage from '$lib/images/logo.jpg'; // <-- 정확한 경로 확인 후 수정

    // Svelte 5 $props()는 layout 컴포넌트에서 필요 없습니다.
    let { children } = $props(); // 이 줄은 삭제합니다.

    // GSAP 관련 변수
    let gsapInstance: any;
    let ScrollTriggerInstance: any;

    // --- 상태 변수 선언 (Svelte 5 $state() 사용) ---
    let isMenuOpen: boolean = $state(false);
    let isHeaderScrolled: boolean = $state(false);
    let activeSubmenuIndex: number | null = $state(null);

    // --- 함수 정의 ---
    function toggleMenu(): void {
        isMenuOpen = !isMenuOpen;
    }

    function closeMenu(): void {
        isMenuOpen = false;
        activeSubmenuIndex = null;
    }

    // 아코디언 메뉴 토글 함수
    function toggleSubmenu(index: number): void {
        if (activeSubmenuIndex === index) {
            activeSubmenuIndex = null; // 이미 열려있으면 닫기
        } else {
            activeSubmenuIndex = index; // 새 메뉴 열기
        }
		console.log(`Submenu ${index} toggled. Active index: ${activeSubmenuIndex}`);
    }

    function handleScroll(): void {
        isHeaderScrolled = window.scrollY > 50;
    }

    // --- 외부 라이브러리 로딩 및 초기화 ---
    // Svelte 5의 반응형 시스템 덕분에, 직접 `page.subscribe`를 호출하고 `unsubscribePage`를 관리할 필요가 줄어듭니다.
    // 대신 `$:` 반응형 선언을 사용하여 `page` 스토어 변화에 반응할 수 있습니다.

    onMount(() => {
        window.addEventListener('scroll', handleScroll);

        Promise.all([
            import('swiper'),
            import('gsap'),
            import('gsap/ScrollTrigger')
        ]).then(([{ default: SwiperLib }, { default: GsapLib }, { default: ScrollTriggerLib }]) => {
            // 라이브러리를 전역 window 객체에 할당 (TypeScript 안전하게)
            (window as any).Swiper = SwiperLib;
            (window as any).gsap = GsapLib;
            (window as any).ScrollTrigger = ScrollTriggerLib;

            gsapInstance = GsapLib;
            ScrollTriggerInstance = ScrollTriggerLib;

            // GSAP에 ScrollTrigger 플러그인 등록
            if (gsapInstance && ScrollTriggerInstance) {
                gsapInstance.registerPlugin(ScrollTriggerInstance);
                console.log("Layout: GSAP and ScrollTrigger registered.");
            }
            console.log("Layout: Swiper and GSAP libraries loaded and assigned to window.");

            // 라우트 변경 시 ScrollTrigger 갱신 로직은 아래 `$: ` 반응형 선언으로 옮깁니다.
            // page.subscribe() 호출 및 unsubscribePage 관리는 이 onMount에서 제거합니다.
        }).catch(error => {
            console.error("Layout: Failed to load external libraries (GSAP/Swiper):", error);
        });

        // --- onMount 훅의 클린업 함수 ---
        // 스크롤 리스너만 해제합니다.
        // GSAP ScrollTrigger 클린업은 onDestroy에서, $page 의존성 클린업은 $: 에서 자동으로 처리됩니다.
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    onDestroy(() => {
        // GSAP과 ScrollTrigger 인스턴스 클린업
        if (gsapInstance) {
            gsapInstance.killTweensOf("*");
            console.log("Layout: GSAP tweens killed.");
        }
        if (ScrollTriggerInstance) {
            ScrollTriggerInstance.getAll().forEach((trigger: any) => trigger.kill());
            ScrollTriggerInstance.clear(); // 모든 트리거를 제거하고 초기 상태로 되돌림
            console.log("Layout: All ScrollTriggers killed.");
        }
    });

    // --- Svelte 5 `$:` 반응형 선언 (page store 변화 감지) ---
    // $page 스토어의 url.pathname 값이 변경될 때마다 이 블록이 재실행됩니다.
    // 이는 Svelte 5에서 스토어 구독을 대체하는 권장 방식입니다.
    $effect: {
        const currentPath = page.url.pathname;
        if (ScrollTriggerInstance) {
            ScrollTriggerInstance.refresh();
            console.log(`Layout: ScrollTrigger.refresh() called due to path change to ${currentPath}.`);
        }
    }
</script>

<header class="site-header" class:scrolled={isHeaderScrolled}>
    <div class="header-container">
        <button class="menu-trigger" class:is-active={isMenuOpen} on:click={toggleMenu}>
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
        </button>

        <div class="logo">
            <a href="/"><img src={LogoImage} alt="SAEUM 로고"></a> </div>

        <div style="width: 45px;"></div>
    </div>
</header>

<nav class="slide-nav-panel" class:is-open={isMenuOpen}>
    <ul class="accordion-menu">
        <li class="menu-item"><a href="/" on:click={closeMenu}>새움학원</a></li>
        <li class="menu-item has-submenu" class:active={activeSubmenuIndex === 0}>
            <a href="#" on:click={(e) => { e.preventDefault(); toggleSubmenu(0); }}>시간표 <span class="arrow-icon"></span></a>
            {#if activeSubmenuIndex === 0}
            <ul class="submenu" transition:slide={{ duration: 300, easing: quintOut }}>
                <li><a href="/schedule?grade=g1" on:click={closeMenu}>고1</a></li>
                <li><a href="/schedule?grade=g2" on:click={closeMenu}>고2</a></li>
                <li><a href="/schedule?grade=g3" on:click={closeMenu}>고3</a></li>
                <li><a href="/schedule?grade=m3" on:click={closeMenu}>중3</a></li>
            </ul>
            {/if}
        </li>
        <li class="menu-item"><a href="/seminar" on:click={closeMenu}>설명회</a></li>
        <li class="menu-item"><a href="/teachers" on:click={closeMenu}>새움강사진</a></li>
        <li class="menu-item has-submenu" class:active={activeSubmenuIndex === 1}>
            <a href="#" on:click={(e) => { e.preventDefault(); toggleSubmenu(1); }}>커뮤니티 <span class="arrow-icon"></span></a>
            {#if activeSubmenuIndex === 1}
            <ul class="submenu" transition:slide={{ duration: 300, easing: quintOut }}>
                <li><a href="/contact" on:click={closeMenu}>문자수신등록</a></li>
                <li><a href="/board?type=notice" on:click={closeMenu}>공지사항</a></li>
                <li><a href="/board?type=recruit" on:click={closeMenu}>인재채용</a></li>
            </ul>
            {/if}
        </li>
        <li class="menu-item"><a href="/location" on:click={closeMenu}>오시는 길</a></li>
    </ul>
</nav>

<div class="overlay" class:is-active={isMenuOpen} on:click={closeMenu}></div>

<main>
    {@render children()}
</main>

<footer class="site-footer">
    <div class="footer-container">
        <div class="footer-logo">
            <img src={LogoImage} alt="새움학원 로고"> </div>
        <hr class="footer-divider">
        <div class="footer-content">
            <div class="footer-col">
                <h4>@SAEUM EDUCATION</h4>
                <address>
                    새움교육미디어 ㅣ 대표 : 박근수 ㅣ 서울시 강남구 대치동 988-18<br>
                    TEL : 02-558-1060 ㅣ 강남교육지원청 등록 제10457호<br>
                    사업자등록번호 : 439-85-01558 ㅣ E-mail : sped9@naver.com
                </address>
            </div>
            <div class="footer-col">
                <h4>페이지 바로가기</h4>
                <ul>
                    <li><a href="/teachers">새움강사진</a></li>
                    <li><a href="#">커뮤니티</a></li>
                    <li><a href="/location">오시는길</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>약관</h4>
                <ul>
                    <li><a href="#">서비스이용약관</a></li>
                    <li><a href="#">개인정보처리방침</a></li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            <p>@2025 SAEUM. All rights reserved.</p>
        </div>
    </div>
</footer>

<style lang="scss">
    @use '@/styles/variables.scss'; // <-- 이 줄은 삭제합니다. (vite.config.ts에서 주입)

    /* site-header 관련 스타일 */
    .site-header {
        position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
        padding: 10px 0; background-color: transparent;
        transition: all 0.4s ease;
        &.scrolled {
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    }
    .header-container {
        display: flex; justify-content: space-between; align-items: center;
        max-width: 1200px; margin: 0 auto; padding: 0 20px;
    }
    .menu-trigger {
        background: none; border: none; cursor: pointer; padding: 10px; z-index: 1002;
    }
    .menu-trigger .line {
        display: block; width: 25px; height: 3px; background-color: #ffffff; // 변수 사용
        margin: 5px 0; transition: all 0.3s ease;
    }
    .site-header.scrolled .menu-trigger .line { background-color: #333333; } // 변수 사용: $secondary-color → #333333
    
    .logo {
        margin: 0 auto; // Flexbox 중앙 정렬 (이전에 논의된 방식)
        z-index: 1000;
    }

    .logo img {
        height: 60px;
        width: auto;
    }

    /* slide-nav-panel 관련 스타일 */
    .slide-nav-panel {
        position: fixed; top: 0; left: -100%; width: 300px; height: 100%;
        background-color: #fff; // 변수 사용 제거, 직접 색상 지정
        padding: 80px 0;
        box-shadow: 5px 0 15px rgba(0,0,0,0.1);
        transition: left 0.4s ease; z-index: 1001; overflow-y: auto;
        &.is-open {
            left: 0;
        }
    }
    .accordion-menu .menu-item a {
        display: flex; justify-content: space-between; align-items: center;
        padding: 15px 20px; font-size: 16px; border-bottom: 1px solid #eee; // 변수 사용
    }
    .accordion-menu .submenu {
        list-style: none; padding-left: 20px; background-color: #f9f9f9; // 변수 사용 고려
        // max-height: 0; overflow: hidden;
    }
    .accordion-menu .submenu a { 
		font-size: 15px; color: #555; // 변수 사용 고려 
	}
    .arrow-icon {
        width: 12px; height: 12px; border-right: 2px solid #ccc; border-bottom: 2px solid #ccc;
        transform: rotate(45deg); transition: transform 0.4s ease;
    }
    .menu-item.active > a > .arrow-icon { transform: rotate(225deg); }


    /* overlay 관련 스타일 */
    .overlay {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0, 0, 0, 0.5); z-index: 999;
        opacity: 0; visibility: hidden;
        transition: opacity 0.4s ease, visibility 0.4s ease;
        &.is-active {
            opacity: 1; visibility: visible;
        }
    }

    /* site-footxer 관련 스타일 */
    .site-footer {
        background-color: #1a237e; // 직접 색상 지정 (예시: 남색)
        color: #fff; // 직접 색상 지정 (예시: 흰색)
        padding: 50px 0;
        font-size: 14px;
        // AOS 관련 opacity/transition은 모두 제거
    }

    .footer-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .footer-logo { text-align: center; margin-bottom: 20px; }
    .footer-logo img { height: 36px; }
    .footer-divider { border: none; border-top: 1px solid rgba(253, 253, 253, 0.3); margin-bottom: 30px; }
    .footer-content { display: flex; justify-content: space-between; gap: 40px; }
    .footer-col { line-height: 2; }
    .footer-col:first-child { flex-grow: 1; }
    .footer-col h4 { font-size: 16px; margin-bottom: 15px; }
    .footer-col ul, .footer-col address { font-style: normal; font-size: 13px; opacity: 0.8; }
    .footer-col a:hover { opacity: 1; text-decoration: underline; }
    .copyright { 
		margin-top: 50px; 
		text-align: center; 
		font-size: 13px; 
		opacity: 0.7; 
	}
</style>