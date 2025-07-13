<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores'; // SvelteKit page store

    // 페이지 히어로 배경 이미지 (assets/board_hero_bg.jpg로 가정)
    import BoardHeroBg from '$lib/images/board_hero_bg.jpg'; // <-- 실제 이미지 경로로 수정

    // --- 데이터와 인터페이스를 별도 파일에서 임포트 ---
    import { boardData, type PostItem, type BoardTypeData } from '$lib/data/boardData'; // <-- 이 줄을 추가합니다.
                                                                                       // (기존 boardData 정의는 삭제)

    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

    // --- 부모로부터 boardType 프롭스를 받습니다 ---
    export let boardType: string; // <-- 이 줄 추가

    // --- 페이지 상태 변수 ---
    // URL 쿼리 파라미터에서 'type' 값을 가져와 currentBoardType에 할당합니다.
    $: {
        const typeParam = $page.url.searchParams.get('type');
        if (typeParam && boardData[typeParam]) {
            currentBoardType = typeParam;
        } else {
            // URL에 'type' 파라미터가 없거나 유효하지 않으면 기본으로 'notice' 설정
            currentBoardType = 'notice';
        }
    }
    let currentBoardType: string = 'notice'; // 현재 게시판 타입 (notice, recruit)

    // --- 페이지 상태 변수 (boardType에 따라 반응) ---
    $: currentBoardData = boardData[boardType] || null; // <-- boardType 사용

    // --- GSAP 애니메이션 ---
    onMount(() => {
        const waitForGsapLibraries = (callback: () => void) => {
            const check = () => {
                if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
                    gsap = (window as any).gsap;
                    ScrollTrigger = (window as any).ScrollTrigger;
                    callback();
                } else {
                    setTimeout(check, 50);
                }
            };
            check();
        };

        waitForGsapLibraries(() => {
            // 페이지 히어로 애니메이션
            gsap.from(".page-hero h1", {
                opacity: 0, y: 50, duration: 1, ease: "power2.out"
            });

            // 게시글 목록 등장 애니메이션
            gsap.from(".notice-table tr", {
                opacity: 0, y: 20, duration: 0.6, stagger: 0.1,
                scrollTrigger: {
                    trigger: ".notice-table",
                    start: "top 80%",
                    markers: false
                }
            });
            console.log("Board Page: GSAP animations defined.");
        });
    });

    // 페이지 언마운트 시 GSAP ScrollTrigger 클린업
    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            ScrollTrigger.clear();
            console.log("Board Page: All ScrollTriggers killed.");
        }
    });
</script>

<section class="page-hero" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('{BoardHeroBg}')">
    <h1>
        {#if currentBoardData}{currentBoardData.pageTitle}
        {:else}게시판
        {/if}
    </h1>
</section>

<div class="page-container">
    <aside class="notice-sidebar">
        <h2>
            {#if currentBoardData}{currentBoardData.boardTitle}
            {:else}게시판
            {/if}
        </h2>
    </aside>

    <div class="notice-content">
        <div class="list-header">
            <span class="total-count">총 <strong>{#if currentBoardData}{currentBoardData.posts.length}{/if}</strong>건</span>
        </div>
        <table class="notice-table">
            <thead>
                <tr><th>제목</th><th>작성일</th></tr>
            </thead>
            <tbody>
                {#if currentBoardData && currentBoardData.posts.length > 0}
                    {#each currentBoardData.posts as post (post.idx)}
                        <tr>
                            <td class="title">
                                <a href="/{currentBoardType}/{post.idx}">{post.title}</a>
s                            </td>
                            <td class="date">{post.date}</td>
                        </tr>
                    {:else}
                        <tr><td colspan="2" style="text-align:center; padding: 50px 0;">게시글이 없습니다.</td></tr>
                    {/each}
                {:else}
                    <tr><td colspan="2" style="text-align:center; padding: 50px 0;">게시판 정보가 없습니다.</td></tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화

    /* ========================
       공지사항/인재채용 페이지 CSS (notice.css 기반)
       ======================== */

    /* 페이지 상단 비주얼 */
    .page-hero {
        padding-top: 80px;
        height: 300px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // 변수 사용
        background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), var(--board-hero-bg-url);
    }
    .page-hero h1 { font-size: 36px; }

    /* [수정] 2단 레이아웃 컨테이너 */
    .page-container {
        display: flex;
        gap: 60px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
    }

    /* [추가] 왼쪽 사이드바 */
    .notice-sidebar {
        width: 250px;
        flex-shrink: 0;
    }
    .notice-sidebar h2 {
        font-size: 24px;
        font-weight: 600;
    }

    /* [추가] 오른쪽 콘텐츠 */
    .notice-content {
        flex-grow: 1;
        /* GSAP 애니메이션을 위한 초기 상태 (테이블 아이템은 개별적으로) */
        /* opacity: 0; */
        /* transform: translateY(20px); */
    }

    /* 공지사항 테이블 */
    .notice-table {
        width: 100%;
        border-collapse: collapse;
        // border-top: 2px solid $primary-font-color; /* 변수 사용 */
    }
    .notice-table th, .notice-table td {
        padding: 15px 10px;
        border-bottom: 1px solid #eee;
        text-align: left;
    }
    .notice-table th {
        display: none; /* '제목', '작성일' 헤더는 숨김 처리 */
    }
    .notice-table td.title a {
        font-size: 16px;
        color: #333;
    }
    .notice-table td.title a:hover {
        text-decoration: underline;
    }
    .notice-table td.date {
        font-size: 14px;
        color: #888;
        text-align: right;
        width: 120px;
    }

    /* [추가] 목록 헤더 스타일 */
    .list-header {
        padding-bottom: 15px;
        margin-bottom: 20px;
        border-bottom: 2px solid $primary-font-color; /* 변수 사용 */
    }
    .list-header .total-count {
        font-size: 14px;
        color: #555;
    }
    .list-header .total-count strong {
        color: $primary-color; /* 변수 사용 */
    }

    /* [추가] 반응형 */
    @media (max-width: 768px) {
        .page-container {
            flex-direction: column; /* 모바일에서 세로로 쌓기 */
            gap: 30px;
        }
        .notice-sidebar {
            width: 100%;
            text-align: center;
            border-bottom: 2px solid $primary-font-color; /* 변수 사용 */
            padding-bottom: 20px;
        }
    }
</style>