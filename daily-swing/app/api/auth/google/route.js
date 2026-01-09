import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: 'No code' }, { status: 400 });
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error('Token error response:', errorText);
      return NextResponse.json({ error: `Token error: ${errorText}` }, { status: 500 });
    }

    const { access_token } = await tokenRes.json();

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error('User error:', errorText);
      return NextResponse.json({ error: `User error: ${errorText}` }, { status: 500 });
    }

    const googleUser = await userRes.json();

    // MongoDB 연결
    await connectDB();

    // 기존 사용자 확인 또는 새 사용자 생성
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.picture,
        googleId: googleUser.id,
        provider: 'google',
      });
      console.log('New user created:', user.email);
    } else {
      // 기존 사용자 업데이트
      user.name = googleUser.name;
      user.image = googleUser.picture;
      user.googleId = googleUser.id;
      user.updatedAt = new Date();
      await user.save();
      console.log('User updated:', user.email);
    }

    // JWT 토큰 생성
    const { sign } = await import('jsonwebtoken');
    const token = sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      },
      token,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
