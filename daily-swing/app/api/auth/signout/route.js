import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json({ success: true });

    // 토큰 쿠키 삭제
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error('로그아웃 오류:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
