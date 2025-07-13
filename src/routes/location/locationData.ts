// src/routes/location/+page.svelte (스크립트 부분)

// 인터페이스 정의
interface LocationItem {
    name: string;
    address: string;
    mapUrl: string;
}

// 지점 데이터 (location-data.js 내용)
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
    // ... 다른 지점 데이터 추가 (실제 지도 URL로 변경)
};