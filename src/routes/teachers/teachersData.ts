// src/routes/teachers/teachersData.ts

// 인터페이스도 export 해야 다른 파일에서 사용할 수 있습니다.
export interface TeacherItem { // <-- export 추가
    id: string;
    name: string;
    subject: string;
    image: string;
    category: string;
    career: string[];
    lectures: string[];
    videoId?: string;
    timetableImage?: string;
}

// 강사 데이터 배열도 export 해야 합니다.
export const allTeachers: TeacherItem[] = [ // <-- export 추가
    {
        id: 'kang-jeong-hwa',
        name: '강정화',
        subject: '국어',
        image: 'https://i.imgur.com/L7R1aWk.png',
        category: 'kor',
        career: ['서울대학교 국어교육과 졸업', '前) 메가스터디', '現) 새움학원 국어과 대표 강사'],
        lectures: ['새움학원 대치 본원', '새움학원 분당 캠퍼스'],
        videoId: 'yq0G26vIu3Q',
        timetableImage: 'https://i.imgur.com/B7ODxLS.png'
    },
    {
        id: 'lee-hyun-woo',
        name: '이현우',
        subject: '영어',
        image: 'https://i.imgur.com/L7R1aWk.png',
        category: 'eng',
        career: ['연세대학교 영어영문학과 졸업', '前) EBSi', '現) 새움학원 영어과 대표 강사'],
        lectures: ['새움학원 대치 본원'],
        videoId: 'yq0G26vIu3Q',
        timetableImage: 'https://i.imgur.com/B7ODxLS.png'
    },
    {
        id: 'yoo-joo-oh',
        name: '유주오',
        subject: '수학',
        image: 'https://i.imgur.com/L7R1aWk.png',
        category: 'math',
        career: ['카이스트 수리과학과 졸업', '現) 새움학원 수학과 대표 강사'],
        lectures: ['새움학원 대치 본원'],
        videoId: 'yq0G26vIu3Q',
        timetableImage: 'https://i.imgur.com/B7ODxLS.png'
    },
    {
        id: 'kim-min-jeong',
        name: '김민정',
        subject: '국어',
        image: 'https://i.imgur.com/L7R1aWk.png',
        category: 'kor',
        career: ['고려대학교 국문학과 졸업', '現) 새움학원 국어과 강사'],
        lectures: ['새움학원 대치 본원'],
        videoId: 'yq0G26vIu3Q',
        timetableImage: 'https://i.imgur.com/B7ODxLS.png'
    }
];

// 카테고리 데이터도 export 합니다.
export const categories = [ // <-- export 추가
    { name: '전체', filter: 'all' },
    { name: '국어', filter: 'kor' },
    { name: '영어', filter: 'eng' },
    { name: '수학', filter: 'math' }
];