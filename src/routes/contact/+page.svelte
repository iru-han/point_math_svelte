<script lang="ts">
    import { onMount } from 'svelte';
    import { quintOut } from 'svelte/easing'; // GSAP 애니메이션용
    import { enhance } from '$app/forms'; // SvelteKit 폼 액션용
    // SvelteKit의 SubmitFunction 타입 정의를 명시적으로 임포트하여 사용할 수 있습니다.
    import type { SubmitFunction } from '@sveltejs/kit'; // <-- 이 줄을 추가합니다.

    // 페이지 히어로 배경 이미지 (src/lib/assets/contact_hero_bg.jpg로 가정)
    // 이 파일이 `src/lib/assets/contact_hero_bg.jpg`에 있는지 확인해주세요.
    import ContactHeroBg from '$lib/images/contact_hero_bg.jpg'; // <-- 실제 이미지 경로로 수정

    // GSAP 관련 변수 (+layout.svelte에서 전역 할당되므로 여기서 import하지 않습니다.)
    let gsap: any;
    let ScrollTrigger: any;

  // --- 폼 데이터 상태 변수 ---
    let studentName: string = '';
    let school: string = '';
    let grade: string = '';
    let phone1: string = '';
    let phone2: string = '';
    let phone3: string = '';

    // 폼 제출 결과 메시지
    let submissionMessage: string = '';
    let isSuccess: boolean = false;

    // --- GSAP 애니메이션 (페이지 로드 시) ---
    onMount(() => {
        // ... (GSAP 초기화 로직은 이전과 동일하게 유지) ...
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
            gsap.from(".page-hero h1", { opacity: 0, y: 50, duration: 1, ease: "power2.out" });
            gsap.from(".form-container", {
                opacity: 0, y: 50, duration: 0.8, delay: 0.2, ease: "power2.out",
                scrollTrigger: { trigger: ".form-container", start: "top 80%", markers: false }
            });
            console.log("Contact Page: GSAP animations defined.");
        });
    });

    // --- 폼 제출 핸들러 (use:enhance와 연동) ---
    // handleSubmit 함수의 인자를 SvelteKit의 SubmitFunction 타입에 맞게 수정합니다.
    // --- 폼 제출 핸들러 (use:enhance와 연동) ---
    // handleSubmit 함수의 구조를 SubmitFunction 타입 정의에 정확히 맞춥니다.
    const handleSubmit: SubmitFunction = async (event) => {
        // 폼 제출이 시작될 때 실행
        console.log('Form submitted:', {
            action: event.action,
            cancel: event.cancel,
            formData: Object.fromEntries(event.formData.entries()),
            formElement: event.formElement
        });

        submissionMessage = '제출 중...';
        isSuccess = false;

        const result = await event.update();

        // update() 이후 result가 최신 상태로 반영됨
        if (result?.data && result.status === 200) {
            submissionMessage = result.data.message || '문자 수신 등록이 완료되었습니다!';
            isSuccess = true;
            studentName = ''; school = ''; grade = ''; phone1 = ''; phone2 = ''; phone3 = '';
        } else {
            submissionMessage = result?.data?.message || `등록 실패: 알 수 없는 오류 (HTTP Status: ${result?.status})`;
            isSuccess = false;
        }
        console.log('Form submission final result:', result);
    };
</script>

<section class="page-hero" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('{ContactHeroBg}')">
    <h1>문자수신등록</h1>
</section>

<div class="form-container">
    <h2 class="form-title">문자수신등록</h2>
    <form method="POST" action="?/register" use:enhance={handleSubmit}>
        <div class="form-group">
            <label for="student-name">학생 이름</label>
            <input type="text" id="student-name" name="student-name" bind:value={studentName}>
        </div>
        <div class="form-group">
            <label for="school">학교</label>
            <input type="text" id="school" name="school" bind:value={school}>
        </div>
        <div class="form-group">
            <label for="grade">학년</label>
            <input type="text" id="grade" name="grade" bind:value={grade}>
        </div>
        <div class="form-group">
            <label for="phone1">학부모님 연락처</label>
            <div class="phone-group">
                <input type="text" id="phone1" name="phone1" maxlength="3" bind:value={phone1}>
                <span>-</span>
                <input type="text" id="phone2" name="phone2" maxlength="4" bind:value={phone2}>
                <span>-</span>
                <input type="text" id="phone3" name="phone3" maxlength="4" bind:value={phone3}>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="submit-btn">제출</button>
        </div>

        {#if submissionMessage}
            <p class="submission-status" class:success={isSuccess} class:error={!isSuccess}>
                {submissionMessage}
            </p>
        {/if}
    </form>
</div>

<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 활성화

    /* ========================
       폼 페이지 CSS (form-page.css 기반)
       ======================== */

    /* 페이지 상단 비주얼 (schedule.css와 동일한 스타일 재사용 가능) */
    .page-hero {
        padding-top: 80px;
        height: 300px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // 변수 사용
        background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), var(--contact-hero-bg-url);
    }
    .page-hero h1 { font-size: 36px; }

    /* 폼 컨테이너 */
    .form-container {
        max-width: 700px;
        margin: 0 auto;
        padding: 80px 20px;
    }

    .form-title {
        font-size: 28px;
        text-align: center;
        margin-bottom: 50px;
    }

    /* 폼 그룹 (라벨 + 인풋) */
    .form-group {
        margin-bottom: 25px;
    }

    .form-group label {
        display: block;
        font-weight: 500;
        margin-bottom: 10px;
        font-size: 15px;
    }

    .form-group input[type="text"] {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    .form-group input[type="text"]:focus {
        outline: none;
        border-color: $primary-color; // 변수 사용
        box-shadow: 0 0 0 2px rgba(0, 113, 188, 0.2); // 변수 사용 고려
    }

    /* 연락처 입력 그룹 */
    .phone-group {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .phone-group input {
        text-align: center;
    }

    .phone-group span {
        color: #ccc;
    }

    /* 제출 버튼 */
    .form-actions {
        text-align: center;
        margin-top: 40px;
    }

    .submit-btn {
        background-color: $primary-color; // 변수 사용
        color: $white; // 변수 사용
        border: none;
        padding: 15px 50px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .submit-btn:hover {
        background-color: darken($primary-color, 10%); // 변수 사용
    }

    /* 제출 결과 메시지 스타일 */
    .submission-status {
        margin-top: 20px;
        padding: 10px;
        border-radius: 5px;
        font-size: 14px;
        text-align: center;
    }
    .submission-status.success {
        background-color: #e6ffe6;
        color: #008000;
        border: 1px solid #008000;
    }
    .submission-status.error {
        background-color: #ffe6e6;
        color: #ff0000;
        border: 1px solid #ff0000;
    }

    /* 반응형 (간단) */
    @media (max-width: 600px) {
        .form-container {
            padding: 40px 15px;
        }
        .form-title {
            font-size: 24px;
            margin-bottom: 30px;
        }
        .submit-btn {
            width: 100%;
            padding: 12px 30px;
        }
    }
</style>