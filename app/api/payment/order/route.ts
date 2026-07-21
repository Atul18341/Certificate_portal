import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Central Platform-Owned Account Key Parameters Setup 
const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_51NxabcXYZ12345"; // Apni key yahan ya .env me dalein
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "mock_secret_key";

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    // Configuration checks fallback if credentials parameters are unlinked
    if (RAZORPAY_KEY_SECRET === "mock_secret_key") {
      return NextResponse.json({
        success: false,
        message: "Demo Mode Active"
      });
    }

    const instance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: Math.round(amount * 100), // Real INR to subunit paise conversion
      currency: "INR",
      receipt: `rcpt_txn_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}