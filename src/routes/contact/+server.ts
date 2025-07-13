// src/routes/contact/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// POST 요청 처리
export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();

        // 폼 필드 데이터 추출
        const studentName = formData.get('student-name')?.toString() || '';
        const school = formData.get('school')?.toString() || '';
        const grade = formData.get('grade')?.toString() || '';
        const phone1 = formData.get('phone1')?.toString() || '';
        const phone2 = formData.get('phone2')?.toString() || '';
        const phone3 = formData.get('phone3')?.toString() || '';

        // 서버에서 데이터 로깅 (실제 서비스에서는 데이터베이스에 저장하거나 이메일 발송)
        console.log('Received form submission:');
        console.log('학생 이름:', studentName);
        console.log('학교:', school);
        console.log('학년:', grade);
        console.log('학부모님 연락처:', `${phone1}-${phone2}-${phone3}`);

        // --- 여기에 실제 데이터 저장 로직 구현 ---
        // 예: await saveToDatabase({ studentName, school, grade, phone1, phone2, phone3 });
        // 예: await sendEmailNotification({ studentName, phone: `${phone1}-${phone2}-${phone3}` });
        // ----------------------------------------

        // 간단한 유효성 검사 (예시)
        if (!studentName || !phone1 || !phone2 || !phone3) {
            return json({ message: '필수 정보를 모두 입력해주세요.', status: 400 });
        }

        // 성공 응답
        // status는 200으로 설정하고, message를 클라이언트로 보냅니다.
        return json({ message: '문자 수신 등록이 완료되었습니다!', status: 200 });

    } catch (error) {
        console.error('Error processing form submission:', error);
        // 오류 응답
        return json({ message: '서버 오류로 인해 등록에 실패했습니다.', status: 500 });
    }
};