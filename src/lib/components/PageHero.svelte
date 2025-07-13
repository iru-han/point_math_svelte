<script lang="ts">
    // 컴포넌트 외부에서 전달받을 속성(props)을 정의합니다.
    export let title: string;
    export let backgroundImage: string; // 이미지 URL을 받을 prop
</script>

<section class="page-hero" style="background-image: url('{backgroundImage}')">
    <h1>{title}</h1>
</section>

<style lang="scss">
    @import '@/styles/variables.scss'; // 변수 임포트 (vite.config.ts에서 주입되므로 여기에 필요 없을 수도 있습니다)

    .page-hero {
        padding-top: 80px;
        height: 300px;
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: $white; // _variables.scss에서 정의된 변수 사용
    }
    .page-hero h1 {
        font-size: 36px;
        text-align: center; // 제목 중앙 정렬
        padding: 0 20px; // 좌우 패딩 추가
    }

    /* 반응형 디자인 추가 (필요시) */
    @media (max-width: 768px) {
        .page-hero {
            height: 200px; // 모바일에서 높이 줄이기
            padding-top: 60px;
        }
        .page-hero h1 {
            font-size: 28px; // 모바일에서 글자 크기 줄이기
        }
    }
</style>