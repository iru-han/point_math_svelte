// src/lib/data/boardData.ts

// 인터페이스 정의 (export)
export interface PostItem {
    idx: number;
    title: string;
    date: string;
    contentImage?: string; // 상세 페이지에서 사용될 이미지 (선택 사항)
}

export interface BoardTypeData {
    pageTitle: string;
    boardTitle: string;
    posts: PostItem[];
}

// 게시판 데이터 (boardData 객체 export)
export const boardData: Record<string, BoardTypeData> = {
    notice: {
        pageTitle: '공지사항',
        boardTitle: '새움학원 공지사항',
        posts: [
            { idx: 12736, title: '새움3관학원 교습비등 게시표', date: '2025-07-11', contentImage: 'https://i.imgur.com/8aJgEof.png' },
            { idx: 7630, title: '새움6관학원 교습비등 게시표', date: '2025-07-10', contentImage: 'https://i.imgur.com/8aJgEof.png' }
        ]
    },
    recruit: {
        pageTitle: '인재채용',
        boardTitle: '새움학원 인재채용',
        posts: [
            { idx: 101, title: '[강사채용] 국어과 정규 강사 모집', date: '2025-07-05', contentImage: 'https://i.imgur.com/8aJgEof.png' },
            { idx: 102, title: '[직원채용] 상담 데스크 및 행정 직원 모집', date: '2025-07-04', contentImage: 'https://i.imgur.com/8aJgEof.png' }
        ]
    }
};