import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, course, email } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }

    const trackingId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const certificateRecord = {
      trackingId,
      name,
      course: course || 'General Certification',
      email: email || '',
      status: 'pending',
      issuedAt: new Date().toISOString(),
      verifyUrl: `https://certibanao.com/verify/${encodeURIComponent(trackingId)}`,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Certificate credential generated successfully',
        certificate: certificateRecord,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process certificate request' },
      { status: 500 }
    );
  }
}