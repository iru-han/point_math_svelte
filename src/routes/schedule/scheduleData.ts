// src/routes/schedule/scheduleData.ts

export interface ScheduleItem {
    category: string;
    title: string;
    image: string; // 이미지 URL
    grade: string[]; // <-- 인터페이스는 그대로 유지
    keywords: string[];
}

export interface GradeSchedule {
    pageTitle: string;
    categories: { filter: string; name: string }[];
    items: ScheduleItem[];
}

export const scheduleData: Record<string, GradeSchedule> = {
    g1: {
        pageTitle: '고1 프로그램 시간표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'bridge', name: '(여름방학전) 브릿지 특강' },
            { filter: 'sparta', name: '스파르타 수학' },
            { filter: 'summer-math', name: '여름방학 고1 수학' },
        ],
        items: [
            // 각 item 객체에 'grade: ['g1']' 추가
            { category: 'bridge', title: '(여름방학전) 고1 브릿지 단기특강', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g1'], keywords: ['브릿지', '단기특강', '여름방학', '고1'] },
            { category: 'sparta', title: '스파르타 수학', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g1'], keywords: ['스파르타', '수학', '고1'] },
            { category: 'summer-math', title: '여름방학 고1 수학', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g1'], keywords: ['여름방학', '수학', '고1'] },
        ]
    },
    g2: {
        pageTitle: '고2 프로그램 시간표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'math-1', name: '수학1' },
            { filter: 'math-2', name: '수학2' },
        ],
        items: [
            // 각 item 객체에 'grade: ['g2']' 추가
            { category: 'math-1', title: '[고2] 수학1 실력반', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g2'], keywords: ['수학1', '실력반', '고2'] },
            { category: 'math-2', title: '[고2] 수학2 심화반', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g2'], keywords: ['수학2', '심화반', '고2'] },
        ]
    },
    g3: {
        pageTitle: '고3 프로그램 시간표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'suneung', name: '수능대비' },
            { filter: 'special', name: '특별반' },
        ],
        items: [
            // 각 item 객체에 'grade: ['g3']' 추가
            { category: 'suneung', title: '[고3] 수능 국어 파이널', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g3'], keywords: ['수능', '국어', '파이널', '고3'] },
            { category: 'special', title: '[고3] 의대 면접 특강', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['g3'], keywords: ['의대', '면접', '특강', '고3'] },
        ]
    },
    m3: {
        pageTitle: '중3 프로그램 시간표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'middle-math', name: '중등 수학' },
            { filter: 'middle-sci', name: '중등 과학' },
        ],
        items: [
            // 각 item 객체에 'grade: ['m3']' 추가
            { category: 'middle-math', title: '[중3] 최상위 수학반', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['m3'], keywords: ['수학', '최상위', '중3'] },
            { category: 'middle-sci', title: '[중3] 영재고 대비 과학', image: 'https://i.imgur.com/B7ODxLS.png', grade: ['m3'], keywords: ['과학', '영재고', '중3'] },
        ]
    }
};