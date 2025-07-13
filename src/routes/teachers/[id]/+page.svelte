<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores'; // SvelteKit page store
    import { quintOut } from 'svelte/easing'; // 이징 함수
    import { base } from '$app/paths'; // <-- 이 줄을 추가합니다!s

    // 강사 데이터 임포트 (src/routes/teachers/teacherData.ts 파일로 분리하는 것을 권장)
    // 현재는 src/routes/teachers/+page.svelte에 정의된 allTeachers 데이터를 가져온다고 가정합니다.
    // 만약 teacherData.ts 파일을 만들었다면 아래 import를 사용합니다.
    import { allTeachers } from '../teachersData'; // teachers/+page.svelte에서 allTeachers 데이터를 임포트한다고 가정

    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

    // no-image 이미지 임포트 (src/lib/images/no-image.png로 가정)
    import NoImage from '$lib/images/no-image.png'; // <-- 실제 경로 확인 후 수정

    // --- 페이지 상태 변수 ---
    let currentTeacher: typeof allTeachers[0] | null = null; // 현재 강사 상세 정보
    let prevTeacher: typeof allTeachers[0] | null = null; // 이전 강사
    let nextTeacher: typeof allTeachers[0] | null = null; // 다음 강사

    // URL 파라미터 [id] 값의 변화에 반응하여 강사 정보 업데이트
    $: {
        const teacherId = $page.params.id; // URL의 [id] 값을 가져옴
        const currentIndex = allTeachers.findIndex(t => t.id === teacherId);

        if (currentIndex !== -1) {
            currentTeacher = allTeachers[currentIndex];
            prevTeacher = currentIndex > 0 ? allTeachers[currentIndex - 1] : null;
            nextTeacher = currentIndex < allTeachers.length - 1 ? allTeachers[currentIndex + 1] : null;

            // 페이지 타이틀 업데이트
            // SvelteKit의 +layout.svelte에서 <svelte:head>를 사용하거나,
            // 아니면 그냥 document.title을 직접 변경합니다.
            if (typeof window !== 'undefined') {
                document.title = `${currentTeacher.name} 강사 - 새움학원`;
            }
        } else {
            currentTeacher = null; // 강사를 찾을 수 없을 때
            if (typeof window !== 'undefined') {
                document.title = '강사 정보를 찾을 수 없음 - 새움학원';
            }
        }
    }

    // 이미지 로드 실패 시 대체 이미지 표시 함수
    function handleImageError(event: Event): void {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = NoImage;
        imgElement.onerror = null; // 무한 루프 방지
    }

    // --- GSAP 애니메이션 (페이지 로드 시) ---
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
            // GSAP 애니메이션 정의
            if (currentTeacher) { // 강사 데이터가 있을 때만 애니메이션 적용
                gsap.from(".detail-header", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" });
                gsap.from(".profile-image", { opacity: 0, scale: 0.9, duration: 1, delay: 0.2, ease: "power2.out" });
                gsap.from(".teacher-info-section h3, .teacher-info-section ul, .video-container, .timetable-image-container", { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, delay: 0.4, ease: "power2.out" });
                gsap.from(".detail-nav, .list-button-wrap", { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: "power2.out" });
            }
            console.log("Teacher Detail Page: GSAP animations defined.");
        });
    });

    // 페이지 언마운트 시 GSAP ScrollTrigger 클린업
    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            // ScrollTrigger.clear(); // 이 함수가 없다면 이전 오류처럼 제거해야 합니다.
            console.log("Teacher Detail Page: All ScrollTriggers killed.");
        }
    });
</script>

<div class="detail-container">
    {#if currentTeacher}
        <div class="detail-header">
            <h1 class="title">[{currentTeacher.subject}] {currentTeacher.name}</h1>
            <p class="subtitle">강사</p>
        </div>

        <div class="profile-image">
            <img src="{currentTeacher.image}" alt="{currentTeacher.name} 프로필 사진" on:error={handleImageError}>
        </div>

        <section class="teacher-info-section">
            {#if currentTeacher.career && currentTeacher.career.length > 0}
            <h3>학력 및 약력</h3>
            <ul>
                {#each currentTeacher.career as item (item)}
                    <li>{item}</li>
                {/each}
            </ul>
            {/if}

            {#if currentTeacher.lectures && currentTeacher.lectures.length > 0}
            <h3>출강 정보</h3>
            <ul>
                {#each currentTeacher.lectures as item (item)}
                    <li>{item}</li>
                {/each}
            </ul>
            {/if}

            {#if currentTeacher.videoId}
            <h3>강의 영상</h3>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/{currentTeacher.videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            {/if}

            {#if currentTeacher.timetableImage}
            <h3>시간표</h3>
            <div class="timetable-image-container">
                <img src="{currentTeacher.timetableImage}" alt="{currentTeacher.name} 강사 시간표">
            </div>
            {/if}
        </section>

        <div class="detail-nav">
            {#if nextTeacher}
            <a href="{base}/teachers/{nextTeacher.id}" class="nav-item">
                <div class="nav-item-title">
                    <span class="nav-arrow">ᐱ</span>
                    <span class="nav-text">다음 강사</span>
                </div>
                <span class="nav-name">[${nextTeacher.subject}] {nextTeacher.name}</span>
            </a>
            {/if}

            {#if prevTeacher}
            <a href="{base}/teachers/{prevTeacher.id}" class="nav-item">
                <div class="nav-item-title">
                    <span class="nav-arrow">ᐯ</span>
                    <span class="nav-text">이전 강사</span>
                </div>
                <span class="nav-name">[${prevTeacher.subject}] {prevTeacher.name}</span>
            </a>
            {/if}
        </div>

        <div class="list-button-wrap">
            <a href="{base}/teachers" class="list-button">목록</a>
        </div>
    {:else}
        <div class="detail-container">
            <h2>강사 정보를 찾을 수 없습니다.</h2>
            <div class="list-button-wrap" style="text-align:center;">
                <a href="{base}/teachers" class="list-button">목록으로 돌아가기</a>
            </div>
        </div>
    {/if}
</div>


<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화

    /* ========================
       강사 상세 페이지 CSS (teacher-detail.css 기반)
       ======================== */

    .detail-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 120px 20px 80px;
    }

    /* 제목 영역 */
    .detail-header {
        text-align: center;
        margin-bottom: 40px;
    }
    .detail-header .title {
        font-size: 32px; /* 원본 22px에서 키움 */
        font-weight: 700; /* 원본 600에서 키움 */
        margin: 0;
        color: $primary-font-color; /* 변수 사용 */
    }
    .detail-header .subtitle {
        font-size: 16px; /* 원본 14px에서 키움 */
        color: #888;
        margin-top: 5px;
    }

    .profile-image {
        width: 100%;
        margin: 40px 0;
        /* animation: fadeIn 1s ease-out; GSAP으로 대체 */
    }
    .profile-image img {
        max-width: 100%;
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        padding: 40px 0;
    }

    /* 강사 상세 정보 섹션 */
    .teacher-info-section {
        margin-bottom: 60px;
    }
    .teacher-info-section h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
        color: $primary-color; /* 변수 사용 */
        border-bottom: 1px solid $light-gray; /* 변수 사용 */
        padding-bottom: 5px;
    }
    .teacher-info-section ul {
        list-style: disc; /* 점 리스트 스타일 */
        padding-left: 25px; /* 왼쪽 여백 */
        margin-bottom: 20px;
    }
    .teacher-info-section li {
        font-size: 15px;
        line-height: 1.8;
        color: #555;
        margin-bottom: 5px;
    }

    /* 비디오 컨테이너 */
    .video-container {
        position: relative;
        padding-bottom: 56.25%; /* 16:9 비율 */
        height: 0;
        overflow: hidden;
        margin-bottom: 20px;
        background-color: $light-gray; /* 변수 사용 */
    }
    .video-container iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    /* 시간표 이미지 컨테이너 */
    .timetable-image-container img {
        max-width: 100%;
        height: auto;
        display: block;
        border: 1px solid #eee;
    }

    /* 하단 네비게이션 */
    .detail-nav {
        display: flex;
        flex-direction: column; /* 세로 정렬 */
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }
    .nav-item {
        display: flex;
        justify-content: space-between; /* 양쪽 정렬 */
        align-items: center;
        padding: 15px 10px;
        text-decoration: none;
        color: #555;
        transition: background-color 0.2s;
        /* min-width는 필요 없음 (Flexbox에서 자동으로 조절) */
    }
    .nav-item:hover {
        background-color: #f9f9f9;
    }
    .nav-item + .nav-item { /* 이전/다음 글 사이에만 선 추가 */
        border-top: 1px solid #eee;
    }
    .nav-item-title {
        display: flex;
        align-items: center;
    }
    .nav-arrow {
        font-size: 16px;
        color: #aaa;
        margin-right: 15px;
    }
    .nav-text {
        font-size: 15px;
    }
    .nav-name { /* [수정] 이전/다음 강사 이름 스타일 */
        font-size: 15px;
        font-weight: 600;
        color: $primary-color; /* 변수 사용 */
    }

    .list-button-wrap {
        margin-top: 40px;
        text-align: center;
    }
    .list-button {
        display: inline-block;
        background-color: $primary-color; /* 변수 사용 */
        color: $white; /* 변수 사용 */
        padding: 10px 30px;
        border-radius: 5px;
        font-size: 15px;
    }
    .list-button:hover {
        background-color: darken($primary-color, 10%); /* 변수 사용 */
    }

    /* 반응형 */
    @media (max-width: 768px) {
        .detail-container {
            padding: 80px 15px 50px;
        }
        .detail-header .title {
            font-size: 26px;
        }
        .detail-header .subtitle {
            font-size: 14px;
        }
        .profile-image {
            margin: 30px 0;
        }
        .profile-image img {
            padding: 20px 0;
        }
        .teacher-info-section h3 {
            font-size: 18px;
        }
        .teacher-info-section ul {
            padding-left: 20px;
        }
        .teacher-info-section li {
            font-size: 14px;
        }
        .nav-item {
            flex-direction: column; /* 이전/다음 버튼 세로 정렬 */
            align-items: flex-start;
            gap: 5px;
            padding: 10px;
        }
        .nav-item-title {
            width: 100%;
            justify-content: flex-start;
        }
        .nav-name {
            align-self: flex-end; /* 이름을 오른쪽으로 */
            font-size: 14px;
        }
        .nav-arrow {
            font-size: 14px;
            margin-right: 10px;
        }
    }
</style>