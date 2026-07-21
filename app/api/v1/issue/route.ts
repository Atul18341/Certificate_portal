import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || "https://jxflprsskwefwnbhhsxp.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const { user_id, checkBalanceOnly, name, course, certHash, studentId } = reqBody;

    if (!user_id || user_id === "null" || user_id.includes("mock")) {
      return NextResponse.json({ error: "Active login token authentication key missing." }, { status: 401 });
    }

    // Tenant Workspace Identity Dynamic Mapping
    const { data: orgWallet, error: walletErr } = await supabase
      .from("organization_wallets")
      .select("*")
      .eq("user_id", user_id)
      .single();

    if (walletErr || !orgWallet) {
      return NextResponse.json({ error: "Tenant isolated profile workspace match failed." }, { status: 404 });
    }

    if (checkBalanceOnly) {
      return NextResponse.json({
        success: true,
        remaining_balance: `INR ${Number(orgWallet.credit_balance).toFixed(2)}`,
        org_id: orgWallet.id
      });
    }

    const cost = Number(orgWallet.per_cert_rate || 15);
    if (Number(orgWallet.credit_balance) < cost) {
      return NextResponse.json({ error: "Insufficient account balance." }, { status: 402 });
    }

    const currentNewBalance = Number(orgWallet.credit_balance) - cost;
    
    // Perform updates inside target database context
    await supabase.from("organization_wallets").update({ credit_balance: currentNewBalance }).eq("id", orgWallet.id);
    await supabase.from("mint_transactions").insert({
      org_id: orgWallet.id,
      student_id_code: studentId || `MINT-${Date.now()}`,
      student_name: name || '',
      course: course,
      cert_hash: certHash
    });

    return NextResponse.json({
      success: true,
      txHash: certHash,
      remaining_balance: `INR ${currentNewBalance.toFixed(2)}`
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}