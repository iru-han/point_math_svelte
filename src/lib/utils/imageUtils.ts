// src/lib/utils/imageUtils.ts

// 대체 이미지 파일 임포트
// 이 경로는 실제 no-image.png 파일의 위치와 일치해야 합니다.
// 예: src/lib/images/no-image.png
import noImageFallback from '$lib/images/no-image.png';

/**
 * 이미지 로드 실패 시 대체 이미지를 표시하는 함수
 * @param event 이미지 요소의 오류 이벤트
 */
export function handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    console.log("Image load error detected for:", imgElement.src); // <-- 추가
    console.log("Attempting to set fallback to:", noImageFallback); // <-- 추가

    if (imgElement.src === noImageFallback) { // 이미 대체 이미지인데 또 에러난 경우 무한루프 방지
        imgElement.onerror = null;
        console.log("Already using fallback, stopping.");
        return;
    }

    imgElement.src = noImageFallback; // 임포트한 대체 이미지 URL로 src 변경
    imgElement.onerror = null; // 무한 루프를 방지하기 위해 onerror 핸들러를 제거
}