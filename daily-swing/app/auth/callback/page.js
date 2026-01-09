'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          console.error('Google OAuth 에러:', error);
          router.push(`/signin?error=${encodeURIComponent(error)}`);
          return;
        }

        if (!code) {
          router.push('/signin?error=no_code');
          return;
        }

        // 서버에 코드 전송
        let response;
        try {
          response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });
        } catch (err) {
          console.error('API 요청 오류:', err);
          router.push(`/signin?error=${encodeURIComponent('네트워크 오류')}`);
          return;
        }

        if (!response.ok) {
          let errorMsg = '로그인 실패';
          try {
            const error = await response.json();
            errorMsg = error.error || errorMsg;
          } catch (e) {
            console.error('오류 응답 파싱 실패:', e);
          }
          router.push(`/signin?error=${encodeURIComponent(errorMsg)}`);
          return;
        }

        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error('응답 파싱 오류:', err);
          router.push(`/signin?error=${encodeURIComponent('응답 처리 오류')}`);
          return;
        }

        if (data.success) {
          router.push('/');
        } else {
          router.push(`/signin?error=${encodeURIComponent(data.error)}`);
        }
      } catch (error) {
        console.error('콜백 처리 오류:', error);
        router.push(`/signin?error=${encodeURIComponent(error.message)}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-700">로그인 처리 중...</p>
      </div>
    </div>
  );
}
