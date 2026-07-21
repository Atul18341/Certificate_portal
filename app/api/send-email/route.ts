import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, name, course, imageBlob } = await request.json();

    if (!email || !imageBlob) {
      return NextResponse.json({ error: "Missing Parameters" }, { status: 400 });
    }

    const base64Data = imageBlob.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "anushkakri92@gmail.com", // 👈 Yahan apni real Gmail dalein
        pass: "etuz mgjx tris bsmb"// 👈 Yahan apna 16 digit app password dalein
      }
    });

    const mailOptions = {
      from: '"Smart Kaushal Portal" <YOUR_OFFICIAL_GMAIL@gmail.com>',
      to: email,
      subject: `Congratulations ${name}! Your Certificate is Ready`,
      text: `Dear ${name},\n\nPlease find your attached certificate for ${course}.\n\nBest Regards,\nTeam Smart Kaushal`,
      attachments: [
        {
          filename: `Certificate_${name.replace(/\s+/g, "_")}.png`,
          content: buffer,
          contentType: "image/png"
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}