import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/pg';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const certId = resolvedParams?.id;

    if (!certId) {
      return NextResponse.json(
        { error: 'Certificate ID is required' },
        { status: 400 }
      );
    }

    const selectSql = 'SELECT * FROM certificates WHERE tracking_id = $1 LIMIT 1;';
    const result = await query(selectSql, [certId]);

    if (!result || result.rows.length === 0) {
      return NextResponse.json(
        { valid: false, message: 'Certificate record not found' },
        { status: 404 }
      );
    }

    const record = result.rows[0];

    return NextResponse.json(
      {
        valid: true,
        certificate: {
          trackingId: record.tracking_id,
          name: record.name,
          course: record.course,
          email: record.email,
          status: record.status,
          issuedAt: record.created_at,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verification Route Error:', error);
    return NextResponse.json(
      { error: 'Server error during verification', details: error.message },
      { status: 500 }
    );
  }
}