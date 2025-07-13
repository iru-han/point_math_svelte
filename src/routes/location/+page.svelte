<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores'; // SvelteKit page store

    // 페이지 히어로 배경 이미지 (assets/location_hero_bg.jpg로 가정)
    import LocationHeroBg from '$lib/images/location_hero_bg.jpg'; // <-- 실제 이미지 경로로 수정

    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

    // --- 지점 데이터 및 인터페이스 정의 ---
    interface LocationItem {
        name: string;
        address: string;
        mapUrl: string;
    }

    const locationData: Record<string, LocationItem> = {
        'bonwon': {
            name: '새움 본관',
            address: '서울특별시 강남구 도곡로 503',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.717904856644!2d127.0543669766946!3d37.514781472044815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3837c35a837%3A0xe54c1b97b0a3b2b!2z7ZSM7J2Y7ZiE6rSA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr' // 예시 지도 URL
        },
        '3gwan': {
            name: '새움 3관',
            address: '서울특별시 강남구 대치동 988-18',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.717904856644!2d127.0543669766946!3d37.514781472044815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3837c35a837%3A0xe54c1b97b0a3b2b!2z7ZSM7J2Y7ZiE6rSA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr' // 예시 지도 URL
        },
        '6gwan': {
            name: '새움 6관',
            address: '서울특별시 강남구 대치동 000-00',
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3164.717904856644!2d127.0543669766946!3d37.514781472044815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3837c35a837%3A0xe54c1b97b0a3b2b!2z7ZSM7J2Y7ZiE6rSA!5e0!3m2!1sko!2skr!4v1700000000000!5m2!1sko!2skr' // 예시 지도 URL
        }
        // ... 다른 지점 데이터 추가
    };

    // --- 페이지 상태 변수 ---
    // URL 쿼리 파라미터에서 'id' 값을 가져와 currentCampusId에 할당합니다.
    // 기본값은 첫 번째 지점의 ID로 설정합니다.
    $: {
        const urlId = $page.url.searchParams.get('id');
        const firstCampusId = Object.keys(locationData)[0];
        if (urlId && locationData[urlId]) {
            currentCampusId = urlId;
        } else {
            currentCampusId = firstCampusId || 'bonwon'; // 데이터가 없을 경우 'bonwon' 기본값
        }
    }
    let currentCampusId: string = 'bonwon'; // 현재 선택된 지점 ID

    // 선택된 지점의 상세 데이터
    $: currentCampus = locationData[currentCampusId] || null;

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

            // 페이지 컨테이너 및 사이드바/콘텐츠 애니메이션
            gsap.from(".page-container > *", { // page-container의 직계 자식 (aside, section)
                opacity: 0, y: 30, duration: 0.8, stagger: 0.2, delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ".page-container",
                    start: "top 80%",
                    markers: false
                }
            });
            console.log("Location Page: GSAP animations defined.");
        });
    });

    // 페이지 언마운트 시 GSAP ScrollTrigger 클린업
    onDestroy(() => {
        if (ScrollTrigger) {
            ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
            // ScrollTrigger.clear(); // 이 함수는 제거합니다.
            console.log("Location Page: All ScrollTriggers killed.");
        }
    });
</script>

<section class="page-hero" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('{LocationHeroBg}')">
    <h1>오시는 길</h1>
</section>

<div class="page-container">
    <aside class="location-sidebar">
        <h2>새움학원 오시는 길</h2>
        <nav id="location-nav" class="accordion-menu">
            <ul>
                {#each Object.entries(locationData) as [id, locItem]}
                    <li class="menu-item" class:active={currentCampusId === id}>
                        <a href="/location?id={id}" on:click|preventDefault={() => currentCampusId = id}>{locItem.name}</a>
                    </li>
                {/each}
            </ul>
        </nav>
    </aside>

    <section id="location-content" class="location-content">
        {#if currentCampus}
            <div class="location-info">
                <h3>{currentCampus.name}</h3>
                <address>{currentCampus.address}</address>
            </div>
            <div class="map-container">
                <iframe src={currentCampus.mapUrl} title="{currentCampus.name} 지도" allowfullscreen loading="lazy"></iframe>
            </div>
        {:else}
            <p style="text-align:center; padding: 40px 0;">지점 정보를 찾을 수 없습니다.</p>
        {/if}
    </section>
</div>


<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화

    /* ========================
       오시는 길 페이지 CSS (location.css 기반)
       ======================== */

    .page-hero {
        padding-top: 80px;
        height: 300px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // 변수 사용
        background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), var(--location-hero-bg-url);
    }
    .page-hero h1 { font-size: 36px; }

    .page-container {
        display: flex;
        gap: 60px;
        max-width: 1200px;
        margin: 0 auto;
        padding: 60px 20px;
    }
    .location-sidebar {
        width: 250px;
        flex-shrink: 0;
    }
    .location-sidebar h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 25px;
    }
    .location-content {
        flex-grow: 1;
        /* GSAP 애니메이션을 위한 초기 상태 */
        // opacity: 0;
        transform: translateY(20px);
    }
    .location-info .address { font-size: 16px; font-style: normal; margin-bottom: 20px; }
    .map-container {
        position: relative; width: 100%; height: 450px; border: 1px solid #eee;
        /* GSAP 애니메이션을 위한 초기 상태 */
        // opacity: 0;
        transform: translateY(20px);
    }
    .map-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }

    .accordion-menu .menu-item a { display: flex; justify-content: space-between; align-items: center; padding: 15px 10px; font-size: 16px; border-bottom: 1px solid $light-gray; /* 변수 사용 */ }
    .accordion-menu .menu-item.active > a { color: $primary-color; /* 변수 사용 */ font-weight: 600; }

    /* 반응형 */
    @media (max-width: 768px) {
        .page-container {
            flex-direction: column;
            gap: 30px;
            padding: 30px 20px;
        }
        .location-sidebar {
            width: 100%;
            text-align: center;
            border-bottom: 2px solid $primary-font-color; /* 변수 사용 */
            padding-bottom: 20px;
        }
        .location-sidebar h2 {
            margin-bottom: 15px;
        }
        .location-content {
            padding: 0;
        }
        .accordion-menu ul {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }
        .accordion-menu .menu-item {
            flex-basis: calc(50% - 5px); /* 모바일에서 2열로 */
            text-align: center;
        }
        .accordion-menu .menu-item a {
            justify-content: center; /* 중앙 정렬 */
            padding: 10px;
            border-radius: 20px; /* 버튼처럼 보이게 */
            border: 1px solid $light-gray;
            font-size: 14px;
        }
        .accordion-menu .menu-item.active > a {
            background-color: $primary-color;
            color: $white;
            border-color: $primary-color;
        }
        .accordion-menu .menu-item.active > a:hover {
            color: $white;
        }
        .accordion-menu .menu-item a:hover {
            background-color: $light-gray;
        }
    }
</style>