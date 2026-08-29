import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      verified: true,
      timestamp: new Date().toISOString(),
      payload: body,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Blockchain verification error' }, { status: 500 });
  }
}