<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import HeroBgImage from '$lib/images/hero_bg.jpeg';

    // Swiper와 Autoplay 모듈을 명시적으로 임포트합니다.
    // 이 경로는 여러분의 node_modules 설치 경로에 따라 다를 수 있습니다.
    // 일반적으로 'swiper/modules'에서 가져옵니다.
    import Swiper from 'swiper';
    import { Autoplay, Scrollbar } from 'swiper/modules'; // Autoplay 모듈 추가

    // GSAP 및 ScrollTrigger도 여기서 임포트하는 것이 좋습니다.
    import { gsap } from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import PageHero from '@/lib/components/PageHero.svelte';

    // GSAP 플러그인 등록
    gsap.registerPlugin(ScrollTrigger);

    let teachersSwiperInstance: Swiper | null = null;

    onMount(() => {
        // 이제 window 객체를 기다릴 필요 없이 바로 Swiper와 GSAP을 사용할 수 있습니다.
        // waitForGlobalLibraries 함수는 더 이상 필요 없습니다.

        // teachers-slider 초기화
        const sliderEl = document.querySelector('.teachers-slider');
        if (sliderEl && !teachersSwiperInstance) {
            teachersSwiperInstance = new Swiper(sliderEl as HTMLElement, {
                modules: [Autoplay], // <-- Autoplay 모듈을 여기에 추가합니다.
                loop: false, // 일단 루프는 끈 상태로 테스트합니다.
                slidesPerView: 'auto',
                centeredSlides: true,
                spaceBetween: 30,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
            });
            console.log("Page: Swiper initialized.");
        }

        // Intro Section Cards
        gsap.from(".info-card", {
            opacity: 0, y: 50, duration: 0.8, stagger: 0.1,
            scrollTrigger: {
                trigger: ".intro-section",
                start: "top 20%",
                // markers: true
            }
        });

        // Teachers Section
        gsap.from(".teachers-section .section-text, .teachers-slider, .teachers-section .common-button", {
            opacity: 0, y: 50, duration: 0.8, stagger: 0.2,
            scrollTrigger: { trigger: ".teachers-section", start: "top 50%"}
        });

        // Seminar Section
        gsap.from(".seminar-card", {
            opacity: 0, y: 50, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: ".seminar-cta-section", start: "top 50%" }
        });

        // Final CTA Section
        gsap.from(".final-cta-section .stats-box, .final-cta-section .common-button", {
            opacity: 0, y: 50, duration: 0.8, stagger: 0.2,
            scrollTrigger: { trigger: ".final-cta-section", start: "top 50%" }
        });

        // Footer
        gsap.from("footer .footer-logo, footer .footer-divider, footer .footer-content, footer .copyright", {
            opacity: 0, y: 50, duration: 0.8, stagger: 0.1,
            scrollTrigger: { trigger: "footer", start: "top 50%" }
        });

        console.log("Page: GSAP ScrollTriggers defined.");
    });

    onDestroy(() => {
        if (teachersSwiperInstance) {
            teachersSwiperInstance.destroy();
            teachersSwiperInstance = null;
        }
        // ScrollTrigger 인스턴스 정리 (필요시)
        // ScrollTrigger.getAll().forEach(st => st.kill());

        // ScrollTrigger 인스턴스가 있다면 모든 트리거를 kill()합니다.
        // ScrollTrigger.clear()는 제거합니다.
		if (typeof window !== 'undefined') {
			if ((window as any).ScrollTrigger) {
				(window as any).ScrollTrigger.getAll().forEach((trigger: any) => trigger.kill());
				console.log("Layout: All ScrollTriggers killed.");
			}
			// GSAP 트윈 정리 (killTweensOf("*")는 모든 활성 트윈을 종료)
			if ((window as any).gsap) {
				(window as any).gsap.killTweensOf("*");
				console.log("Layout: GSAP tweens killed.");
			}
		}
    });
	
</script>

<PageHero title="" backgroundImage={HeroBgImage} />

<section class="intro-section">
    <div class="section-container">
        <div class="intro-text">
            <h2>대학 입시의 성공,<br><strong>철저한 데이터와 경험에서 시작됩니다.</strong></h2>
            <p>
                새움학원은 대치동에서 설립된 이래, 다년간의 축적된 데이터와 체계적인 입시 전략을 통해 수많은 성공 사례를 만들어왔습니다. 입시의 핵심을 꿰뚫는 전문 강사진과 탄탄한 노하우로, 학생들이 대학 입시에서 한 걸음 앞서 나아갈 수 있도록 돕습니다.
            </p>
        </div>

        <div class="card-grid">
            <a href="#" class="info-card">
                <div class="card-content">
                    <h3>중등 시간표</h3>
                    <p>고등학교 준비의 첫걸음,<br>기초를 다지는 과정</p>
                    <span>더 알아보기 ></span>
                </div>
                <img src="https://i.imgur.com/uSt2o1A.png" alt="책과 사과" class="card-image">
            </a>
            <a href="#" class="info-card">
                <div class="card-content">
                    <h3>고1 시간표</h3>
                    <p>주요 과목 심화와 역량 강화를 통한<br>고등학교 중반 대비 과정</p>
                    <span>더 알아보기 ></span>
                </div>
                <img src="https://i.imgur.com/gKCy4sX.png" alt="컴퍼스" class="card-image">
            </a>
            <a href="#" class="info-card">
                <div class="card-content">
                    <h3>고2 시간표</h3>
                    <p>내신과 수능 기초 개념과<br>문제 해결력을 강화하는 과정</p>
                    <span>더 알아보기 ></span>
                </div>
                <img src="https://i.imgur.com/X4u2M0r.png" alt="삼각자" class="card-image">
            </a>
            <a href="#" class="info-card">
                <div class="card-content">
                    <h3>고3 시간표</h3>
                    <p>대학 입시를 위한 집중적이고<br>체계적인 준비 과정</p>
                    <span>더 알아보기 ></span>
                </div>
                <img src="https://i.imgur.com/XqTrmw7.png" alt="책과 손" class="card-image">
            </a>
        </div>
    </div>
</section>

<section class="teachers-section">
    <div class="section-container">
        <div class="section-text">
            <p class="sub-heading">성공적인 대학입시를 이끄는</p>
            <h2><strong>새움학원 대표 강사진</strong></h2>
        </div>
        
        <div class="swiper teachers-slider">
            <div class="swiper-wrapper">
                <div class="swiper-slide"><img src="https://cdn.imweb.me/thumbnail/20250124/2c09f7a8decce.png" alt="이수진 강사"><div class="teacher-info"><h4>이수진</h4><p>국어</p></div></div>
                <div class="swiper-slide"><img src="https://cdn.imweb.me/thumbnail/20250124/2c09f7a8decce.png" alt="이현우 강사"><div class="teacher-info"><h4>이현우</h4><p>영어</p></div></div>
                <div class="swiper-slide"><img src="https://cdn.imweb.me/thumbnail/20250124/2c09f7a8decce.png" alt="유주오 강사"><div class="teacher-info"><h4>유주오</h4><p>수학</p></div></div>
                <div class="swiper-slide"><img src="https://cdn.imweb.me/thumbnail/20250124/2c09f7a8decce.png" alt="강정화 강사"><div class="teacher-info"><h4>강정화</h4><p>국어</p></div></div>
            </div>
        </div>

        <div class="view-more-button">
            <a href="#" class="common-button">강사진 전체보기</a>
        </div>
    </div>
</section>

<section class="seminar-cta-section">
    <div class="section-container">
        <div class="section-text">
            <p class="sub-heading">새움학원 입시 설명회</p>
            <h2>명강사들의 입시 전략과 정보를 제공하는<br>입시설명회 일정을 확인하세요.</h2>
        </div>

        <div class="seminar-grid">
            <a href="#" class="seminar-card">
                <h3>2025 중3 설명회</h3>
                <span>더 알아보기 ></span>
            </a>
            <a href="#" class="seminar-card">
                <h3>2025 고1 설명회</h3>
                <span>더 알아보기 ></span>
            </a>
            <a href="#" class="seminar-card">
                <h3>2025 고2 설명회</h3>
                <span>더 알아보기 ></span>
            </a>
            <a href="#" class="seminar-card">
                <h3>2025 고3 설명회</h3>
                <span>더 알아보기 ></span>
            </a>
        </div>
    </div>
</section>

<section class="final-cta-section">
    <div class="section-container">
        <div class="section-text">
            <h2>지금 바로,<br><strong>새움과 함께 성공의 시작을 함께 하세요.</strong></h2>
        </div>

        <div class="stats-box">
            <div class="stat-item">
                <span class="stat-number">100K+</span>
                <span class="stat-label">누적 수강생</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">2013.07</span>
                <span class="stat-label">설립일</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">10+</span>
                <span class="stat-label">캠퍼스</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">80+</span>
                <span class="stat-label">강사</span>
            </div>
        </div>

        <div class="cta-button-wrap">
            <a href="tel:02-123-4567" class="common-button">전화상담 신청</a>
        </div>
    </div>
</section>

<style lang="scss">
    @import '@/styles/variables.scss'; // <-- 이 줄의 주석을 해제합니다.

    // --- Hero Section ---
    .hero-section {
        height: 100vh;
        background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), var(--hero-bg-url);
        background-size: cover; background-position: center;
        display: flex; align-items: center; justify-content: center;
        color: $white;
        text-align: center;
        position: relative;
        z-index: 1;
    }

    // --- Intro Section ---
    .intro-section {
        padding: 80px 0;
        background-color: #f8f8f8;
        text-align: center;
    }

    .intro-text {
        margin-bottom: 50px;
    }

    .intro-text h2 {
        font-size: 2.5em;
        margin-bottom: 20px;
        line-height: 1.4;
    }

    .intro-text strong {
        color: $primary-color;
    }

    .intro-text p {
        font-size: 1.1em;
        max-width: 800px;
        margin: 0 auto;
        line-height: 1.6;
        color: #555;
    }

    .card-grid {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 30px;
        max-width: 1200px;
        margin: 0 auto;
        // overflow-x: auto;
        padding-bottom: 10px;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        &::-webkit-scrollbar { display: none; }

        .info-card:nth-child(odd) { margin-bottom: 50px; }
        .info-card:nth-child(even) { margin-top: 50px; }
    }

    .info-card {
        flex: 0 0 250px;
        background-color: $white;
        padding: 30px;
        border: 1px solid #e0e0e0;
        border-radius: 10px;
        text-decoration: none;
        color: #333;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-height: 250px;
        text-align: left;

        &:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .card-content { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
        h3 { font-size: 1.6em; color: $primary-color; margin-bottom: 10px; }
        p { font-size: 1em; color: #666; line-height: 1.5; margin-bottom: 15px; }
        span { font-size: 0.9em; color: $primary-color; font-weight: bold; display: block; margin-top: auto; }
        .card-image { width: 100px; height: auto; margin-top: 20px; align-self: flex-end; }
    }

    @media (max-width: 991px) {
        .card-grid { flex-wrap: wrap; justify-content: center; }
        .info-card { flex: 0 0 calc(50% - 15px); margin-top: 0 !important; flex-direction: column; align-items: flex-start; }
        .info-card .card-image { align-self: flex-end; margin-left: 0; }
        @media (max-width: 600px) { .info-card { flex: 0 0 100%; } }
    }

    // --- Teachers Section ---
    .teachers-section {
        padding: 80px 0;
        background-color: $white;
        text-align: center;
    }

    .teachers-section .section-text { margin-bottom: 50px; }
    .teachers-section .sub-heading { font-size: 1.1em; color: $primary-color; margin-bottom: 10px; }
    .teachers-section h2 { font-size: 2.5em; margin-bottom: 20px; line-height: 1.4; color: $primary-font-color; }
    .teachers-section strong { color: $primary-font-color; }

    .teachers-slider { width: 100%; padding-bottom: 40px; }
    .swiper-slide {
        width: 250px; text-align: center; background: $white;
        border-radius: 10px; overflow: hidden; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex; flex-direction: column; justify-content: flex-start; align-items: center;
        &:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
        img { width: 100%; height: 200px; object-fit: cover; border-bottom: 1px solid #eee; }
    }
    .teacher-info { padding: 15px; width: 100%; }
    .teacher-info h4 { font-size: 1.3em; margin-bottom: 5px; color: $primary-font-color; }
    .teacher-info p { font-size: 0.9em; color: #777; }

    .view-more-button { margin-top: 30px; }
    .view-more-button a {
        display: inline-block; padding: 12px 30px;
        background-color: $primary-color;
        color: $white;
        border-radius: 5px; font-size: 1.1em; transition: background-color 0.3s ease;
        &:hover { 
			background-color: darken($primary-color, 10%); 
		}
    }

    // --- Seminar CTA Section ---
    .seminar-cta-section {
        padding: 80px 0;
        background-color: #eef7fc;
        text-align: center;
    }

    .seminar-cta-section .section-text { margin-bottom: 50px; }
    .seminar-cta-section .sub-heading { font-size: 1.1em; color: $primary-color; margin-bottom: 10px; }
    .seminar-cta-section h2 { font-size: 2.5em; margin-bottom: 20px; line-height: 1.4; color: $primary-font-color; }

    .seminar-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    .seminar-card {
        background-color: $white;
        border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        padding: 30px; text-align: left;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex; flex-direction: column; justify-content: space-between; min-height: 150px;
        &:hover { transform: translateY(-10px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15); }
        h3 { font-size: 1.6em; color: $primary-font-color; margin-bottom: 15px; }
        span { font-size: 0.9em; color: $primary-color; font-weight: bold; display: block; margin-top: auto; }
    }

    @media (max-width: 768px) {
        .seminar-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 480px) {
        .seminar-grid { grid-template-columns: 1fr; }
    }

    // --- Final CTA Section ---
    .final-cta-section {
        padding: 80px 0;
        background-color: $primary-color;
        color: $white;
        text-align: center;
    }

    .final-cta-section .section-text { margin-bottom: 50px; }
    .final-cta-section h2 { font-size: 2.5em; margin-bottom: 20px; line-height: 1.4; }
    .final-cta-section strong { color: $white; }

    .stats-box { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 40px; margin-bottom: 50px; }
    .stat-item { text-align: center; }
    .stat-number { font-size: 3em; font-weight: bold; display: block; margin-bottom: 10px; }
    .stat-label { font-size: 1.1em; opacity: 0.8; }

    .cta-button-wrap { margin-top: 30px; }
    .common-button {
        display: inline-block; padding: 15px 40px;
        background-color: $white;
        color: $primary-color;
        border-radius: 5px; font-size: 1.2em; font-weight: bold;
        transition: background-color 0.3s ease, color 0.3s ease;
        &:hover { background-color: #f0f0f0; color: darken($primary-color, 10%); }
    }

    /* 미디어 쿼리 (반응형 디자인) */
    @media (max-width: 768px) {
        .hero-content h1 { font-size: 2.5em; }
        .hero-content p { font-size: 1em; }
        .intro-text h2, .teachers-section h2, .seminar-cta-section h2, .final-cta-section h2 { font-size: 2em; }
        .card-grid, .seminar-grid { grid-template-columns: 1fr; }
        .info-card, .seminar-card { padding: 20px; }
        .footer-content { flex-direction: column; text-align: center; gap: 20px; }
        .footer-col { margin-bottom: 15px; }
        .footer-col:first-child { margin-bottom: 25px; }
        .footer-col ul { padding: 0; }
        .footer-col li { display: inline-block; margin: 0 10px; }
        .stats-box { flex-direction: column; gap: 20px; }
        .stat-number { font-size: 2.5em; }
    }

    @media (max-width: 480px) {
        .hero-content h1 { font-size: 2em; }
        .intro-text h2, .teachers-section h2, .seminar-cta-section h2, .final-cta-section h2 { font-size: 1.8em; }
        .info-card h3, .seminar-card h3 { font-size: 1.4em; }
        .common-button { padding: 12px 30px; font-size: 1.1em; }
    }
</style>