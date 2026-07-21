import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.SUPABASE_URL || "https://jxflprsskwefwnbhhsxp.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

// Simple encryption utility function for production safety
function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, email, password, fullName, companyName } = body;

    if (action === "signup") {
      // 1. Double check user registration duplicate rules
      const { data: existingUser } = await supabase.from("saas_users").select("id").eq("email", email).single();
      if (existingUser) {
        return NextResponse.json({ error: "Email address already registered!" }, { status: 400 });
      }

      // 2. Insert User Identity
      const { data: newUser, error: userErr } = await supabase.from("saas_users").insert({
        full_name: fullName,
        email: email,
        password_hash: hashPassword(password)
      }).select().single();

      if (userErr || !newUser) throw new Error("User creation pipeline failed.");

      // 3. Create isolated corporate tenant dashboard workspace
      await supabase.from("organization_wallets").insert({
        user_id: newUser.id,
        company_name: companyName || `${fullName}'s Center`
      });

      return NextResponse.json({ success: true, message: "Registration successful! Please login." });
    }

    if (action === "login") {
      const { data: user, error } = await supabase
        .from("saas_users")
        .select("id, full_name, email, password_hash")
        .eq("email", email)
        .single();

      if (error || !user || user.password_hash !== hashPassword(password)) {
        return NextResponse.json({ error: "Invalid login email credentials or password." }, { status: 401 });
      }

      // Safe deployment browser session management data returning payload
      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.full_name, email: user.email }
      });
    }

    return NextResponse.json({ error: "Invalid pipeline execution requested" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}