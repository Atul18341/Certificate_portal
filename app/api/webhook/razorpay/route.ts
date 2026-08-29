import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify webhook signature agar secret configured hai
    if (secret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    // Handle payment events safely
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentData = payload.payload?.payment?.entity;
      const amount = paymentData ? paymentData.amount / 100 : 0;
      const paymentId = paymentData ? paymentData.id : 'UNKNOWN';

      console.log(`Razorpay Payment Processed: ${paymentId} for INR ${amount}`);
    }

    return NextResponse.json({ status: 'ok', received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed', details: error.message },
      { status: 500 }
    );
  }
}