import { NextResponse } from 'next/server';
import { query } from '@/app/lib/pg';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, course, email, region } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Student name is required' },
        { status: 400 }
      );
    }

    const trackingId = 'CERT-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const insertSql = `
      INSERT INTO certificates (tracking_id, name, course, email, region, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      trackingId,
      name,
      course || 'General Certification',
      email || '',
      region || 'Global',
      'pending',
    ];

    const result = await query(insertSql, values);
    const savedRecord = result.rows[0];

    return NextResponse.json(
      {
        success: true,
        message: 'Certificate registered successfully in PostgreSQL',
        certificate: {
          id: savedRecord.id,
          trackingId: savedRecord.tracking_id,
          name: savedRecord.name,
          course: savedRecord.course,
          email: savedRecord.email,
          region: savedRecord.region,
          status: savedRecord.status,
          issuedAt: savedRecord.created_at,
          verifyUrl: `https://certibanao.com/verify/${encodeURIComponent(savedRecord.tracking_id)}`,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('PostgreSQL Insert Error:', error);
    return NextResponse.json(
      { error: 'Database transaction failed', details: error.message },
      { status: 500 }
    );
  }
}