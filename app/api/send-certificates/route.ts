import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_build");

interface StudentEmailPayload {
  email: string;
  name: string;
  certificateId: string;
  certificateUrl: string;
}

export async function POST(request: Request) {
  try {
    const { students, organizationName }: { students: StudentEmailPayload[]; organizationName: string } = await request.json();

    if (!students || !Array.isArray(students) || students.length === 0) {
      return NextResponse.json({ error: "No student records provided" }, { status: 400 });
    }

    // Send emails in parallel batch
    const emailPromises = students.map((student) =>
      resend.emails.send({
        from: `${organizationName} <certifications@credvantage.com>`,
        to: [student.email],
        subject: `🎉 Congratulations ${student.name}! Your Official Certificate is Ready`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #4f46e5; margin-bottom: 8px;">Your Verified Certificate has been Issued!</h2>
            <p style="font-size: 14px;">Dear <strong>${student.name}</strong>,</p>
            <p style="font-size: 14px; line-height: 1.5;">
              Congratulations on successfully completing your program with <strong>${organizationName}</strong>. 
              Your official credential (ID: <code>${student.certificateId}</code>) is now verified and available online.
            </p>
            <div style="margin: 24px 0; text-align: center;">
              <a href="${student.certificateUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
                View & Download Certificate
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #64748b; text-align: center;">
              Secured & Verified by CredVantage Pro Network
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);

    return NextResponse.json({ success: true, message: `Successfully sent ${students.length} certificate emails!` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to dispatch emails" }, { status: 500 });
  }
}