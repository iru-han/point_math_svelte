<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { quintOut } from 'svelte/easing'; // 이징 함수
    import { slide } from 'svelte/transition'; // Svelte 트랜지션
    import { page } from '$app/stores'; // SvelteKit page store

    // 페이지 히어로 배경 이미지 (assets/teachers_hero_bg.jpg로 가정)
    import TeachersHeroBg from '$lib/images/teachers_hero_bg.jpg'; // <-- 실제 이미지 경로로 수정
    import NoImage from '$lib/images/no-image.png'; // <-- 이 줄을 추가합니다.

    // imageUtils.ts 파일에서 handleImageError 함수 임포트
    import { handleImageError } from '$lib/utils/imageUtils'; // <-- 이 줄을 추가합니다.


    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

    // --- 강사 데이터 및 인터페이스 정의 ---
    interface TeacherItem {
        id: string;
        name: string;
        subject: string;
        image: string;
        category: string; // 'kor', 'eng', 'math' 등
        career: string[]; // 학력/약력
        lectures: string[]; // 출강 정보
        videoId?: string; // 유튜브 영상 주소의 ID 부분 (선택 사항)
        timetableImage?: string; // 시간표 이미지 주소 (선택 사항)
    }

    // 강사 데이터 배열 (teacher-data.js 내용)
    const allTeachers: TeacherItem[] = [
        {
            id: 'kang-jeong-hwa',
            name: '강정화',
            subject: '국어',
            image: 'https://i.imgur.com/L7R1aWk.png',
            category: 'kor',
            career: ['서울대학교 국어교육과 졸업', '前) 메가스터디', '現) 새움학원 국어과 대표 강사'],
            lectures: ['새움학원 대치 본원', '새움학원 분당 캠퍼스'],
            videoId: 'yq0G26vIu3Q',
            timetableImage: 'https://i.imgur.com/B7ODxLS.png'
        },
        {
            id: 'lee-hyun-woo',
            name: '이현우',
            subject: '영어',
            image: 'https://i.imgur.com/L7R1aWk.png',
            category: 'eng',
            career: ['연세대학교 영어영문학과 졸업', '前) EBSi', '現) 새움학원 영어과 대표 강사'],
            lectures: ['새움학원 대치 본원'],
            videoId: 'yq0G26vIu3Q',
            timetableImage: 'https://i.imgur.com/B7ODxLS.png'
        },
        {
            id: 'yoo-joo-oh',
            name: '유주오',
            subject: '수학',
            image: 'https://i.imgur.com/L7R1aWk.png',
            category: 'math',
            career: ['카이스트 수리과학과 졸업', '現) 새움학원 수학과 대표 강사'],
            lectures: ['새움학원 대치 본원'],
            videoId: 'yq0G26vIu3Q',
            timetableImage: 'https://i.imgur.com/B7ODxLS.png'
        },
        {
            id: 'kim-min-jeong',
            name: '김민정',
            subject: '국어',
            image: 'https://i.imgur.com/L7R1aWk.png',
            category: 'kor',
            career: ['고려대학교 국문학과 졸업', '現) 새움학원 국어과 강사'],
            lectures: ['새움학원 대치 본원'],
            videoId: 'yq0G26vIu3Q',
            timetableImage: 'https://i.imgur.com/B7ODxLS.png'
        },
        // ... 필요한 만큼 더 많은 강사 데이터 추가 ...
        // (이미지 URL은 예시이므로 실제 강사 이미지로 변경해야 합니다)
    ];

    // 카테고리 데이터
    const categories = [
        { name: '전체', filter: 'all' },
        { name: '국어', filter: 'kor' },
        { name: '영어', filter: 'eng' },
        { name: '수학', filter: 'math' }
        // 필요에 따라 다른 과목 추가 (예: '과학', '사회' 등)
    ];

    // --- 페이지 상태 변수 ---
    let currentCategory: string = 'all'; // 현재 선택된 카테고리 필터

    // 필터링된 강사 목록 (반응형)
    $: filteredTeachers = allTeachers.filter(teacher => {
        return currentCategory === 'all' || teacher.category === currentCategory;
    });

    // 카테고리 필터 변경 함수
    function setCategory(filter: string): void {
        currentCategory = filter;
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
            // 페이지 히어로 애니메이션
            gsap.from(".page-hero h1", {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out"
            });

            // 강사 카드 등장 애니메이션
            gsap.from(".teacher-card", {
                opacity: 0,
                y: 50, // 아래에서 위로
                duration: 0.6,
                stagger: 0.1, // 각 카드마다 0.1초씩 지연
                scrollTrigger: {
                    trigger: ".teacher-grid", // 그리드가 뷰포트에 들어올 때 애니메이션 시작
                    start: "top 80%",
                    markers: false // 디버깅용 마커 (배포 시 제거)
                }
            });
            console.log("Teachers Page: GSAP animations defined.");
        });
    });

    // 페이지 언마운트 시 GSAP ScrollTrigger 클린업
    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            ScrollTrigger.clear();
            console.log("Teachers Page: All ScrollTriggers killed.");
        }
    });
</script>

<section class="page-hero" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('{TeachersHeroBg}')">
    <h1>새움학원 강사진</h1>
</section>

<div class="page-container">
    <nav class="category-nav">
        {#each categories as category (category.filter)}
            <a href="#" class="category-link" class:active={currentCategory === category.filter} onclick={(e) => { e.preventDefault(); setCategory(category.filter) }}>{category.name}</a>
        {/each}
    </nav>

    <div class="teacher-grid">
        {#each filteredTeachers as teacher (teacher.id)}
            <div class="teacher-card">
                <a href="/teachers/{teacher.id}">
                    <div class="img-wrap">
                        <img src="{teacher.image}" alt="{teacher.name} 강사" onerror={handleImageError}>
                    </div>
                    <h4>{teacher.name}</h4>
                    <p>[{teacher.subject}]</p>
                </a>
            </div>
        {:else}
            <p style="text-align:center; padding: 40px 0;">해당 카테고리에 맞는 강사진이 없습니다.</p>
        {/each}
    </div>
</div>

<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화

    /* ========================
       강사진 페이지 CSS (teachers.css 기반)
       ======================== */

    .page-hero {
        padding-top: 80px; /* 헤더 높이만큼 */
        height: 300px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // 변수 사용
        background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), var(--teachers-hero-bg-url);
    }
    .page-hero h1 { font-size: 36px; }

    .page-container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }

    .category-nav { display: flex; justify-content: center; flex-wrap: wrap; gap: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
    .category-link { padding: 5px 0; font-size: 16px; font-weight: 500; color: #888; border-bottom: 2px solid transparent; cursor: pointer; transition: all 0.2s ease; }
    .category-link:hover { color: #333; }
    .category-link.active { color: $primary-color; /* 변수 사용 */ font-weight: 600; border-bottom-color: $primary-color; /* 변수 사용 */ }

    .teacher-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; }
    .teacher-card {
        text-align: center;
        /* GSAP 애니메이션을 위한 초기 상태 */
        // opacity: 0;
        transform: translateY(20px);
    }
    // .teacher-card.hidden-by-filter { display: none; } // Svelte의 {#each} 필터링으로 대체
    .teacher-card a { display: block; text-decoration: none; color: inherit; }
    .teacher-card .img-wrap {
        border-radius: 10px; /* 기본값으로 10px 설정 */
        overflow: hidden;
        margin-bottom: 15px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05); /* 그림자 추가 */
    }
    .teacher-card img { width: 100%; height: auto; display: block; transition: transform 0.3s ease; }
    .teacher-card a:hover img { transform: scale(1.05); }
    .teacher-card h4 { font-size: 18px; margin: 0 0 5px 0; }
    .teacher-card p { font-size: 14px; color: #777; margin: 0; }


    @media (max-width: 992px) { .teacher-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 768px) { .teacher-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 480px) { .teacher-grid { grid-template-columns: 1fr; } } // 작은 모바일에서 1열 추가
</style>