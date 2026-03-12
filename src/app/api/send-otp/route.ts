import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    if (!email) {
      return NextResponse.json({ sent: false, error: 'Email is required' }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn('[send-otp] RESEND_API_KEY not set — skipping email')
      return NextResponse.json({ sent: false })
    }

    const resend = new Resend(apiKey)
    const otpCode = process.env.OTP_STATIC_CODE || '123456'

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Locus <onboarding@resend.dev>',
      to: email,
      subject: `🔐 Your Locus Verification Code: ${otpCode}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0f1e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0f1e;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#111827,#1a2332);border-radius:16px;border:1px solid rgba(45,212,191,0.2);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 20px;text-align:center;">
              <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                🚀 Welcome to <span style="color:#2dd4bf;">Locus</span>
              </h1>
              <p style="margin:8px 0 0;font-size:15px;color:#9ca3af;">
                Your AI Authority Content Platform
              </p>
            </td>
          </tr>

          <!-- OTP Code -->
          <tr>
            <td style="padding:20px 40px;">
              <div style="background:rgba(45,212,191,0.08);border:1px solid rgba(45,212,191,0.25);border-radius:12px;padding:30px;text-align:center;">
                <p style="margin:0 0 8px;font-size:14px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;">
                  Your Verification Code
                </p>
                <p style="margin:0;font-size:42px;font-weight:800;color:#2dd4bf;letter-spacing:12px;">
                  ${otpCode}
                </p>
              </div>
            </td>
          </tr>

          <!-- Hi Name -->
          <tr>
            <td style="padding:10px 40px 20px;">
              <p style="margin:0;font-size:16px;color:#e5e7eb;">
                Hi${name ? ' ' + name : ''} 👋,
              </p>
              <p style="margin:12px 0 0;font-size:15px;color:#9ca3af;line-height:1.6;">
                Enter the code above to verify your account and unlock the full power of Locus.
              </p>
            </td>
          </tr>

          <!-- IMPORTANT: Move to Primary -->
          <tr>
            <td style="padding:10px 40px;">
              <div style="background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.3);border-radius:12px;padding:20px;">
                <p style="margin:0 0 8px;font-size:15px;color:#fbbf24;font-weight:600;">
                  ⚠️ Important — Don't Miss Our Emails!
                </p>
                <p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6;">
                  If this email landed in <strong>Spam</strong> or <strong>Promotions</strong>, please move it to your <strong style="color:#2dd4bf;">Primary Inbox</strong>. This ensures you'll receive exclusive discounts and updates from us!
                </p>
                <p style="margin:12px 0 0;font-size:13px;color:#9ca3af;">
                  📌 Gmail: Open email → Click ⋮ → "Move to" → Primary<br>
                  📌 Outlook: Right-click → "Move to Focused"
                </p>
              </div>
            </td>
          </tr>

          <!-- Special Gift CTA -->
          <tr>
            <td style="padding:20px 40px;">
              <div style="background:linear-gradient(135deg,rgba(45,212,191,0.12),rgba(16,185,129,0.12));border:1px solid rgba(45,212,191,0.3);border-radius:12px;padding:24px;text-align:center;">
                <p style="margin:0 0 4px;font-size:28px;">🎁</p>
                <p style="margin:0 0 8px;font-size:17px;color:#2dd4bf;font-weight:700;">
                  Claim Your Special Gift!
                </p>
                <p style="margin:0;font-size:14px;color:#d1d5db;line-height:1.6;">
                  Simply <strong style="color:#ffffff;">reply to this email</strong> with the word <strong style="color:#2dd4bf;">"GIFT"</strong> and we'll send you an exclusive bonus — completely free!
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#6b7280;">
                © 2026 Locus. All rights reserved.<br>
                You received this because you signed up at locus.app
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('[send-otp] Resend error:', error)
      return NextResponse.json({ sent: false })
    }

    return NextResponse.json({ sent: true })
  } catch (err) {
    console.error('[send-otp] Unexpected error:', err)
    return NextResponse.json({ sent: false })
  }
}
