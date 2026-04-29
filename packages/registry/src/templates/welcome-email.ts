type WelcomeEmailParams = {
  licenseKey: string
  orderId: string
}

export function renderWelcomeEmail({ licenseKey, orderId }: WelcomeEmailParams): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Your Kiwa UI license key</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f5;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;padding:40px;">
            <tr>
              <td>
                <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;font-weight:600;">Thanks for picking up Kiwa UI Pro Blocks</h1>
                <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#444;">Your license key unlocks all 130+ pro blocks for life. Keep this email. It's the only proof of purchase we issue.</p>

                <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Your license key</p>
                <pre style="margin:0 0 28px 0;padding:14px 16px;background:#f3f3f0;border-radius:8px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;overflow-x:auto;">${licenseKey}</pre>

                <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:600;">How to use it</h2>
                <ol style="margin:0 0 24px 20px;padding:0;font-size:14px;line-height:1.7;color:#333;">
                  <li style="margin-bottom:10px;">Set your license key as an environment variable in the shell where you run the CLI:<br /><code style="display:inline-block;margin-top:6px;padding:6px 10px;background:#f3f3f0;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">export KIWA_UI_TOKEN=${licenseKey}</code></li>
                  <li style="margin-bottom:10px;">Initialize Kiwa UI in a fresh project (skip if you already ran <code style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;">init</code>):<br /><code style="display:inline-block;margin-top:6px;padding:6px 10px;background:#f3f3f0;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">npx @kiwa-ui/cli@latest init</code></li>
                  <li style="margin-bottom:10px;">Add any pro block to your project:<br /><code style="display:inline-block;margin-top:6px;padding:6px 10px;background:#f3f3f0;border-radius:6px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">npx @kiwa-ui/cli@latest add hero-03</code></li>
                  <li>Browse the full catalogue at <a href="https://kiwaui.com/docs" style="color:#0066cc;text-decoration:underline;">kiwaui.com/docs</a>.</li>
                </ol>

                <p style="margin:0 0 8px 0;font-size:13px;color:#666;">Order reference: ${orderId}</p>
                <p style="margin:0;font-size:13px;color:#666;">Questions? Just reply to this email.</p>
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0 0;font-size:12px;color:#999;">Tossell Web Solutions Limited · kiwaui.com</p>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

export function renderWelcomeEmailText({ licenseKey, orderId }: WelcomeEmailParams): string {
  return `Thanks for picking up Kiwa UI Pro Blocks.

Your license key unlocks all 130+ pro blocks for life. Keep this email. It's the only proof of purchase we issue.

Your license key:
${licenseKey}

How to use it:

1. Set your license key as an environment variable in the shell where you run the CLI:

   export KIWA_UI_TOKEN=${licenseKey}

2. Initialize Kiwa UI in a fresh project (skip if you already ran init):

   npx @kiwa-ui/cli@latest init

3. Add any pro block to your project:

   npx @kiwa-ui/cli@latest add hero-03

4. Browse the full catalogue at https://kiwaui.com/docs.

Order reference: ${orderId}

Questions? Just reply to this email.

Tossell Web Solutions Limited · kiwaui.com
`
}
