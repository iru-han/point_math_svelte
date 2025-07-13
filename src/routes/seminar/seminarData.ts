// src/routes/seminar/seminarData.ts

// ScheduleItem과 유사하지만, 설명회에 맞게 필드명 조정 가능
export interface SeminarItem {
    category: string; // 예: summer-program, regular-admission
    title: string;
    description?: string; // 간략한 설명 (아코디언 헤더 밑에 표시 가능)
    date: string; // 날짜 정보 (예: '2025년 7월 20일 (토)')
    time: string; // 시간 정보 (예: '오후 2시')
    location?: string; // 장소 (예: '새움학원 대강의실')
    image?: string; // 상세 이미지 (아코디언 콘텐츠 내부)
    grade: string[]; // 해당 설명회 대상 학년 (예: ['g1'])
    keywords: string[]; // 검색용 키워드
    status: 'scheduled' | 'closed' | 'completed'; // 상태 (예: 예정, 마감, 종료)
}

export interface GradeSeminar {
    pageTitle: string;
    categories: { filter: string; name: string }[];
    items: SeminarItem[];
}

export const seminarData: Record<string, GradeSeminar> = {
    g1: {
        pageTitle: '고1 설명회 일정표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'summer', name: '여름방학 학습전략' },
            { filter: 'special', name: '특별 설명회' },
        ],
        items: [
            { category: 'summer', title: '25년 고1 여름방학 학습전략 & 입시설명회', date: '2/28(금)', time: '7시', location: '본관 1층 대강의실', image: 'http://googleusercontent.com/file_content/0', grade: ['g1'], keywords: ['여름방학', '학습전략', '입시', '고1'], status: 'scheduled' },
            { category: 'special', title: '이현우샘 단대부고 간담회', date: '2/28(금)', time: '7시', grade: ['g1'], keywords: ['간담회', '이현우', '단대부고', '고1'], status: 'scheduled' },
            { category: 'summer', title: '고1 윈터스쿨 설명회', date: '미정', time: '미정', grade: ['g1'], keywords: ['윈터스쿨', '여름방학', '고1'], status: 'scheduled' },
        ]
    },
    g2: {
        pageTitle: '고2 설명회 일정표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'midterm', name: '중간고사 대비' },
            { filter: 'final', name: '기말고사 대비' },
        ],
        items: [
            { category: 'midterm', title: '25년 고2 중간고사 대비 설명회', date: '3/15(토)', time: '2시', grade: ['g2'], keywords: ['중간고사', '고2'], status: 'scheduled' },
            { category: 'final', title: '고2 여름방학 특강 설명회', date: '7/10(수)', time: '4시', grade: ['g2'], keywords: ['여름방학', '특강', '고2'], status: 'scheduled' },
        ]
    },
    g3: {
        pageTitle: '고3 설명회 일정표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'suneung', name: '수능대비' },
            { filter: 'essay', name: '논술' },
        ],
        items: [
            { category: 'suneung', title: '25년 고3 수능 전략 설명회', date: '4/1(월)', time: '10시', grade: ['g3'], keywords: ['수능', '전략', '고3'], status: 'scheduled' },
            { category: 'essay', title: '고3 논술 파이널 설명회', date: '9/1(일)', time: '3시', grade: ['g3'], keywords: ['논술', '파이널', '고3'], status: 'scheduled' },
        ]
    },
    m3: {
        pageTitle: '중3 설명회 일정표',
        categories: [
            { filter: 'all', name: '전체' },
            { filter: 'high-prep', name: '고등 선행' },
        ],
        items: [
            { category: 'high-prep', title: '25년 중3 고등 선행 학습 설명회', date: '1/20(월)', time: '6시', grade: ['m3'], keywords: ['고등선행', '중3'], status: 'scheduled' },
        ]
    }
};