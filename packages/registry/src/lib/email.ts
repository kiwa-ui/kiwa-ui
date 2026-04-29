import { renderWelcomeEmail, renderWelcomeEmailText } from '../templates/welcome-email'

export async function sendWelcomeEmail(params: {
  apiKey: string
  to: string
  licenseKey: string
  orderId: string
}): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Kiwa UI <hello@kiwaui.com>',
      reply_to: 'hello@kiwaui.com',
      to: [params.to],
      subject: 'Your Kiwa UI license key',
      html: renderWelcomeEmail({ licenseKey: params.licenseKey, orderId: params.orderId }),
      text: renderWelcomeEmailText({ licenseKey: params.licenseKey, orderId: params.orderId }),
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend send failed (${res.status}): ${body}`)
  }
}
