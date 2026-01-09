import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // 유효성 검사
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    // MongoDB 연결
    await connectDB();

    // 기존 사용자 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다' },
        { status: 400 }
      );
    }

    // 비밀번호 해싱
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // 새로운 사용자 생성
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: '회원가입 성공',
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('회원가입 오류:', error);
    return NextResponse.json(
      { error: error.message || '회원가입 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
