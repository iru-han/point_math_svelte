<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores'; // SvelteKit 2.x에서는 $app/stores가 맞습니다. (Svelte 5에서도 작동)
    import { quintOut } from 'svelte/easing';
    import { slide } from 'svelte/transition'; // 아코디언 슬라이드 트랜지션
    import { base } from '$app/paths'; // <-- 이 줄을 추가합니다!

    // Hero 섹션 배경 이미지 (src/lib/assets/schedule_hero_bg.jpg로 가정)
    // 이 파일이 `src/lib/assets/schedule_hero_bg.jpg`에 있는지 확인해주세요.
    import ScheduleHeroBg from '$lib/images/schedule_hero_bg.jpg'; // <-- 실제 이미지 경로로 수정

    // 시간표 데이터 임포트
    // 만약 scheduleData를 별도 파일(src/routes/schedule/scheduleData.ts)로 만들었다면 임포트
    import { scheduleData } from './scheduleData'; // <-- 이 줄을 추가합니다.
                                                  // 또는 아래 const allSchedules 대신 scheduleData 사용.
                                                  // 이 경우 allSchedules 변수 정의는 삭제합니다.


    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

    // --- 페이지 상태 변수 ---
    // URL 쿼리 파라미터에서 'grade' 값을 가져와 currentGrade에 할당합니다.
    // Svelte의 반응형 $: 구문을 사용하여 $page.url.searchParams 변화에 반응합니다.
    $: {
        const gradeParam = $page.url.searchParams.get('grade');
        if (gradeParam && scheduleData[gradeParam]) { // URL 파라미터가 유효한 학년 데이터에 있는지 확인
            currentGrade = gradeParam;
        } else {
            // URL에 'grade' 파라미터가 없거나 유효하지 않으면 기본 학년 'g1' (고1)으로 설정
            currentGrade = 'g1';
        }
        // 학년이 변경될 때 카테고리와 검색어를 초기화
        currentCategory = 'all';
        searchQuery = '';
        activeAccordionItem = null; // 아코디언도 모두 닫기
    }
    let currentGrade: string | null = null; // 현재 선택된 학년 (g1, g2, g3, m3)
    let currentCategory: string = 'all'; // 현재 선택된 카테고리 (all, bridge, sparta 등)
    let searchQuery: string = ''; // 검색어

    // 선택된 학년의 데이터
    $: currentGradeData = currentGrade ? scheduleData[currentGrade] : null;

    // 필터링된 시간표 목록 (반응형)
    $: filteredSchedules = currentGradeData ? currentGradeData.items.filter(item => {
        // 1. 카테고리 필터링
        const categoryMatch = currentCategory === 'all' || item.category === currentCategory;

        // 2. 검색어 필터링 (title과 keywords 모두 검색)
        const searchMatch = searchQuery
            ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.keywords && item.keywords.some(kw => kw.toLowerCase().includes(searchQuery.toLowerCase())))
            : true;

        return categoryMatch && searchMatch;
    }) : [];

    // 아코디언 상태 관리
    let activeAccordionItem: number | null = null; // 현재 열린 아코디언 아이템의 인덱스

    function toggleAccordion(index: number): void {
        activeAccordionItem = activeAccordionItem === index ? null : index;
    }

    function setCategory(category: string): void {
        currentCategory = category;
        searchQuery = ''; // 카테고리 변경 시 검색어 초기화
        activeAccordionItem = null; // 카테고리 변경 시 모든 아코디언 닫기
    }

    function handleSearch(event: Event): void {
        searchQuery = (event.target as HTMLInputElement).value;
        activeAccordionItem = null; // 검색 시 모든 아코디언 닫기
    }

    // --- 라이브러리 로딩 및 초기화 (GSAP) ---
    onMount(() => {
        // window.gsap과 window.ScrollTrigger가 로드될 때까지 기다리는 함수
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
            // 페이지 히어로 애니메이션 (GSAP)
            gsap.from(".page-hero h1", {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });

            // 아코디언 아이템 등장 애니메이션
            // 새로운 필터링 결과가 나올 때마다 애니메이션을 다시 적용할 수 있도록
            // $: 블록 안에서 ScrollTrigger를 새로고침하거나,
            // ScrollTrigger.create()를 사용할 때마다 kill()하고 다시 생성하는 방식을 고려해야 합니다.
            // 여기서는 페이지 로드 시 한 번만 적용하는 방식으로 구현합니다.
            gsap.from(".accordion-item", {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.1, // 각 아이템마다 0.1초씩 지연
                scrollTrigger: {
                    trigger: ".accordion-list",
                    start: "top 80%", // 아코디언 리스트 상단이 뷰포트 80%에 도달할 때 시작
                    markers: false // 디버깅용 마커 (배포 시 제거)
                }
            });
            console.log("Schedule Page: GSAP animations defined.");
        });
    });

    // 페이지 언마운트 시 GSAP ScrollTrigger 클린업
    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            ScrollTrigger.clear();
            console.log("Schedule Page: All ScrollTriggers killed.");
        }
    });
</script>

<section class="page-hero" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('{ScheduleHeroBg}')">
    <h1>
        {#if currentGradeData}{currentGradeData.pageTitle}
        {:else}시간표
        {/if}
    </h1>
</section>

<div class="page-container">
    <aside class="schedule-sidebar">
        <h2>새움학원 시간표</h2>
        <nav class="grade-nav">
            <ul>
                <li class:active={currentGrade === 'g1'}><a href="{base}/schedule?grade=g1" onclick={(e) => { e.preventDefault(); currentGrade = 'g1'; $page.url.searchParams.set('grade', 'g1'); }}>고1</a></li>
                <li class:active={currentGrade === 'g2'}><a href="{base}/schedule?grade=g2" onclick={(e) => { e.preventDefault(); currentGrade = 'g2'; $page.url.searchParams.set('grade', 'g2'); }}>고2</a></li>
                <li class:active={currentGrade === 'g3'}><a href="{base}/schedule?grade=g3" onclick={(e) => { e.preventDefault(); currentGrade = 'g3'; $page.url.searchParams.set('grade', 'g3'); }}>고3</a></li>
                <li class:active={currentGrade === 'm3'}><a href="{base}/schedule?grade=m3" onclick={(e) => { e.preventDefault(); currentGrade = 'm3'; $page.url.searchParams.set('grade', 'm3'); }}>중3</a></li>
            </ul>
        </nav>
    </aside>

    <section class="schedule-content">
        <nav class="category-nav">
            {#if currentGradeData}
                {#each currentGradeData.categories as category (category.filter)}
                    <a href="#" class="category-link" class:active={currentCategory === category.filter} onclick={(e) => { e.preventDefault(); setCategory(category.filter); }}>{category.name}</a>
                {/each}
            {:else}
                <a href="#" class="category-link active">카테고리 없음</a>
            {/if}
        </nav>

        <div class="accordion-list">
            {#each filteredSchedules as item, index (item.title + index)}
                <div class="accordion-item" class:active={activeAccordionItem === index}>
                    <div class="accordion-header" onclick={() => toggleAccordion(index)}>
                        <span class="accordion-title">{item.title}</span>
                        <span class="accordion-arrow"></span>
                    </div>
                    {#if activeAccordionItem === index}
                    <div class="accordion-content" transition:slide={{ duration: 300, easing: quintOut }}>
                        <div class="content-inner"><img src={item.image} alt="{item.title} 시간표 이미지"></div>
                    </div>
                    {/if}
                </div>
            {:else}
                <p style="text-align:center; padding: 40px 0;">현재 선택된 조건에 맞는 시간표가 없습니다.</p>
            {/each}
        </div>

        <div class="search-container">
            <input type="text" class="schedule-search-input" placeholder="강의명으로 검색..." oninput={handleSearch} bind:value={searchQuery}>
        </div>
    </section>
</div>


<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화 (언더스코어 포함)

    /* ========================
       시간표 페이지 CSS (수정)
       ======================== */

    /* 페이지 상단 비주얼 */
    .page-hero {
        height: 400px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // 변수 사용
        background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), var(--schedule-hero-bg-url);
    }
    .page-hero h1 {
        font-size: 36px;
        font-weight: 700;
    }

    /* 2단 레이아웃 */
    .page-container {
        display: flex;
        gap: 60px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
    }

    /* [수정] 왼쪽 사이드바 */
    .schedule-sidebar {
        width: 200px;
        flex-shrink: 0;
    }
    .schedule-sidebar h2 {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 25px;
    }
    .grade-nav ul {
        display: flex;
        flex-direction: column; /* 세로로 정렬 */
        gap: 10px;
    }
    .grade-nav ul li a {
        display: block;
        padding: 11px 15px;
        font-size: 16px;
        font-weight: 500;
        color: #555;
        border-radius: 25px; /* 둥근 모서리 버튼 */
        transition: all 0.2s ease;
    }
    .grade-nav ul li a:hover {
        background-color: #f0f0f0;
    }
    .grade-nav ul li.active a {
        background-color: $primary-color; // 변수 사용
        font-weight: 600;
        color: $white; // 변수 사용
    }

    /* 오른쪽 콘텐츠 */
    .schedule-content {
        flex-grow: 1;
    }
    /* [수정] 카테고리 메뉴 */
    .category-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 30px;
        border-bottom: 1px solid #eee;
        padding-bottom: 15px;
        margin-bottom: 20px;
    }
    .category-link {
        padding: 5px 0;
        font-size: 16px;
        font-weight: 500;
        color: #888;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .category-link:hover {
        color: #333;
    }
    .category-link.active {
        color: $primary-color; // 변수 사용
        font-weight: 600;
        border-bottom-color: $primary-color; // 변수 사용
    }

    /* 아코디언 목록 */
    .accordion-list { border-top: 2px solid #333; }
    .accordion-item {
        border-bottom: 1px solid #eee;
        /* GSAP 애니메이션을 위한 초기 상태 */
        // opacity: 0;
        transform: translateY(20px); // 아래에서 위로 살짝 올라오게
    }
    /* Svelte slide transition이 max-height를 제어하므로 CSS에서 직접 max-height:0;은 유지하되, transition:max-height;는 제거 */
    .accordion-item .accordion-content {
        // max-height: 0;
        overflow: hidden;
        // transition: max-height 0.5s ease-out; // Svelte transition:slide가 처리하므로 제거
        background-color: #fafafa;
    }

    .accordion-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 10px; cursor: pointer; }
    .accordion-title { font-size: 16px; font-weight: 500; }
    .accordion-arrow { width: 10px; height: 10px; border-right: 2px solid #ccc; border-bottom: 2px solid #ccc; transform: rotate(45deg); transition: transform 0.4s ease; }
    .accordion-item.active .accordion-arrow { transform: rotate(225deg); }
    
    .content-inner { padding: 20px; }
    .content-inner img { max-width: 100%; border: 1px solid #eee; }

    /* [수정] 검색창 위치 변경에 따른 스타일 */
    .search-container {
        margin-top: 40px; /* 아코디언 목록과의 간격 */
    }
    .schedule-search-input {
        width: 100%;
        padding: 12px 15px;
        font-size: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        text-align: center;
    }

    /* 반응형 */
    @media (max-width: 768px) {
        .page-container {
            flex-direction: column;
            gap: 30px;
            padding: 30px 20px;
        }
        .schedule-sidebar {
            width: 100%;
        }
        .grade-nav ul {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
        }
        .schedule-sidebar h2 {
            text-align: center;
        }
        .category-nav {
            justify-content: center;
        }
    }
</style>