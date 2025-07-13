<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores'; // SvelteKit page store
    import { quintOut } from 'svelte/easing';

    // boardData와 인터페이스 임포트 (src/lib/data/boardData.ts에서)
    import { boardData, type BoardTypeData, type PostItem } from '$lib/data/boardData';

    // 이미지 로드 에러 처리 함수 임포트
    import { handleImageError } from '$lib/utils/imageUtils';
    import { base } from '$app/paths'; // <-- 이 줄을 추가합니다!

    // GSAP 관련 변수
    let gsap: any;
    let ScrollTrigger: any;

    // --- 데이터 프롭스로 받기 (load 함수로부터) ---
    export let data; // load 함수에서 반환한 { boardType, currentBoardData, currentPost } 객체를 받습니다.

    // 데이터 변수를 직접 data 프롭스에서 가져옵니다.
    // $: 구문은 이 data 객체의 속성이 변경될 때마다 이 블록을 재실행합니다.
    $: boardType = data.boardType as string; // 'notice' 또는 'recruit'
    $: currentBoardData = data.currentBoardData as BoardTypeData; // 전체 게시판 데이터
    $: currentPost = data.currentPost as PostItem; // 현재 게시글 상세 데이터

    // 이전/다음 게시글 계산 (currentPost.idx를 기준으로)
    let prevPost: PostItem | null = null;
    let nextPost: PostItem | null = null;

    $: { // currentPostData 또는 currentPost가 변경될 때마다 재계산
        if (currentPost && currentBoardData) { // 게시글과 게시판 데이터가 모두 있을 때만 계산
            const allPosts = currentBoardData.posts; // 전체 게시글 목록
            const currentIndex = allPosts.findIndex((p: PostItem) => p.idx === currentPost.idx); // 현재 게시글의 인덱스

            prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
            nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

            // 페이지 타이틀 업데이트
            if (typeof window !== 'undefined') {
                document.title = `${currentPost.title} - 새움학원`;
            }
        } else {
            // 강사를 찾을 수 없거나 데이터가 불완전할 때 페이지 타이틀 설정
            if (typeof window !== 'undefined') {
                document.title = '게시글을 찾을 수 없음 - 새움학원';
            }
        }
    }

    // --- GSAP 애니메이션 (이전과 동일) ---
    onMount(() => {
        const waitForGsapLibraries = (callback: () => void) => { /* ... */ };
        waitForGsapLibraries(() => {
            if (currentPost) { // 게시글 데이터가 있을 때만 애니메이션 적용
                gsap.from(".post-header", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
                gsap.from(".post-body", { opacity: 0, y: 30, duration: 0.8, delay: 0.2, ease: "power2.out" });
                gsap.from(".post-nav, .list-button-wrap", { opacity: 0, y: 20, duration: 0.8, delay: 0.4, ease: "power2.out" });
            }
            console.log("Board Detail Page: GSAP animations defined.");
        });
    });

    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            console.log("Board Detail Page: All ScrollTriggers killed.");
        }
    });
</script>

<div class="page-container">
    <aside class="detail-sidebar">
        <h2>
            {#if currentBoardData}{currentBoardData.boardTitle}
            {:else}게시판
            {/if}
        </h2>
    </aside>

    <div class="detail-content" id="detail-main-content">
        {#if currentPost}
            <div class="post-header">
                <h1>{currentPost.title}</h1>
                <p>작성일: {currentPost.date}</p>
            </div>
            <div class="post-body">
                {#if currentPost.contentImage}
                    <img src={currentPost.contentImage} alt="{currentPost.title} 이미지" on:error={handleImageError}>
                {:else}
                    <p style="text-align:center; color: #888;">첨부 이미지가 없습니다.</p>
                {/if}
            </div>
            <div class="post-nav">
                {#if nextPost}
                    <a href="{base}/{boardType}/{nextPost.idx}" class="nav-item">
                        <span class="nav-label">다음글</span>
                        <span class="nav-title">{nextPost.title}</span>
                    </a>
                {/if}
                {#if prevPost}
                    <a href="{base}/{boardType}/{prevPost.idx}" class="nav-item">
                        <span class="nav-label">이전글</span>
                        <span class="nav-title">{prevPost.title}</span>
                    </a>
                {/if}
            </div>
            <div class="list-button-wrap">
                <a href="{base}/{boardType}" class="list-button">목록</a>
            </div>
        {:else}
            <div class="post-header">
                <h1>게시글을 찾을 수 없습니다.</h1>
                <p>요청하신 게시글의 정보가 없거나, URL이 올바르지 않습니다.</p>
            </div>
            <div class="list-button-wrap">
                <a href="{base}/notice" class="list-button">공지사항 목록으로 돌아가기</a>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    @import '@/styles/variables.scss';
    /* ========================
       게시판 상세 페이지 CSS (board-detail.css 기반)
       ======================== */

    .page-container {
        display: flex;
        gap: 60px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 120px 20px 80px;
    }
    .detail-sidebar {
        width: 250px;
        flex-shrink: 0;
    }
    .detail-sidebar h2 {
        font-size: 24px;
        font-weight: 600;
    }
    .detail-content {
        flex-grow: 1;
        /* GSAP 애니메이션을 위한 초기 상태 */
        // opacity: 0;
        transform: translateY(20px);
    }
    .post-header {
        padding-bottom: 20px;
        border-bottom: 2px solid $primary-font-color; /* 변수 사용 */
    }
    .post-header h1 {
        font-size: 22px;
        margin: 0;
    }
    .post-header p {
        font-size: 14px;
        color: #888;
        margin-top: 10px;
    }
    .post-body {
        padding: 40px 10px;
        border-bottom: 1px solid #eee;
    }
    .post-body img {
        max-width: 100%;
        height: auto; /* 높이를 자동으로 조절하여 비율 유지 */
        display: block; /* 블록 요소로 만들어 여백을 없앰 */
        margin: 0 auto; /* 중앙 정렬 */
    }
    .post-nav {
        border-bottom: 1px solid #eee;
    }
    .nav-item {
        display: flex;
        justify-content: space-between; /* 양쪽 정렬 */
        align-items: center;
        padding: 15px 10px;
        color: #555;
        transition: background-color 0.2s;
    }
    .nav-item:hover {
        background-color: #f9f9f9;
    }
    .nav-item + .nav-item {
        border-top: 1px solid #eee;
    }
    .nav-label {
        font-size: 14px;
        color: $primary-color; /* 변수 사용 */
        margin-right: 20px;
    }
    .nav-title {
        font-size: 16px;
    }
    .list-button-wrap {
        text-align: center;
        margin-top: 40px;
    }
    .list-button {
        display: inline-block;
        background-color: $primary-color; /* 변수 사용 */
        color: $white; /* 변수 사용 */
        padding: 12px 40px;
        border: 1px solid $primary-color; /* 변수 사용 */
        border-radius: 5px;
        font-size: 15px;
        transition: background-color 0.2s ease, color 0.2s ease;
    }
    .list-button:hover {
        background-color: darken($primary-color, 10%); /* 변수 사용 */
        color: $white;
    }

    /* 반응형 */
    @media (max-width: 768px) {
        .page-container {
            flex-direction: column;
            gap: 30px;
            padding: 80px 15px 50px;
        }
        .detail-sidebar {
            width: 100%;
            text-align: center;
            border-bottom: 2px solid $primary-font-color; /* 변수 사용 */
            padding-bottom: 20px;
        }
        .detail-content {
            padding: 0;
        }
        .post-header {
            text-align: center;
        }
        .post-body {
            padding: 20px 0;
        }
        .nav-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            padding: 10px;
        }
        .nav-label {
            width: 100%;
            margin-right: 0;
            text-align: left;
        }
        .nav-title {
            width: 100%;
            text-align: left;
        }
    }
</style>