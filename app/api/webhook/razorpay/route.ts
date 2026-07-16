import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const SUPABASE_URL = "https://jxflprsskwefwnbhhsxp.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// 🔥 Security Secret: Razorpay dashboard me jo webhook secret set karoge, wo yahan ayega
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET !;

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-Razorpay-Signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 1. Verify that the request is genuinely coming from Razorpay (Anti-Hack Check)
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature webhook fraud" }, { status: 403 });
    }

    const eventData = JSON.parse(rawBody);

    // 2. Process only if payment is captured successfully
    if (eventData.event === "payment.captured") {
      const payment = eventData.payload.payment.entity;
      const orderId = payment.order_id;
      const amountPaid = Number(payment.amount) / 100; // Razorpay amounts are in paise (e.g., 50000 = ₹500)

      console.log(`[Webhook] Payment Captured for Order: ${orderId}, Amount: ₹${amountPaid}`);

      // 3. Find transaction in database to get the organization ID
      const { data: txRecord, error: txErr } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("razorpay_order_id", orderId)
        .single();

      if (txErr || !txRecord) {
        return NextResponse.json({ error: "Order context not found" }, { status: 404 });
      }

      if (txRecord.status === "captured") {
        return NextResponse.json({ message: "Already processed" }, { status: 200 });
      }

      // 4. Update Organization's Wallet Balance (Top-up Cash)
      const { data: wallet } = await supabase
        .from("organization_wallets")
        .select("credit_balance")
        .eq("id", txRecord.org_id)
        .single();

      const currentBalance = Number(wallet?.credit_balance || 0);
      const updatedBalance = currentBalance + amountPaid;

      // Update credit balance
      await supabase
        .from("organization_wallets")
        .update({ credit_balance: updatedBalance })
        .eq("id", txRecord.org_id);

      // Update payment transaction logs status
      await supabase
        .from("payment_transactions")
        .update({ status: "captured", razorpay_payment_id: payment.id })
        .eq("razorpay_order_id", orderId);

      return NextResponse.json({ success: true, new_balance: updatedBalance });
    }

    return NextResponse.json({ status: "ignored_event" });

  } catch (err: any) {
    console.error("Webhook System Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}