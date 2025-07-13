<script lang="ts">
    import BoardDetailContent from '$lib/components/BoardDetailContent.svelte';

    // load 함수에서 받아온 데이터를 BoardDetailContent 컴포넌트에 프롭스로 전달
    export let data;
</script>

<BoardDetailContent {data} />