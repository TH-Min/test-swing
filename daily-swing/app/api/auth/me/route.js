import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { verify } from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    await connectDB();

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('인증 확인 오류:', error);
    return NextResponse.json({ user: null });
  }
}
