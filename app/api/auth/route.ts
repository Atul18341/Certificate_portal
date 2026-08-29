import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, user: body });
  } catch (error) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 400 });
  }
}