import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendNewsletterNotification(email: string) {
  try {
    // Notify admin about new newsletter subscription
    await resend.emails.send({
      from: 'PublishType Newsletter <onboarding@resend.dev>',
      to: [process.env.ADMIN_EMAIL || 'your-email@example.com'],
      subject: 'New Newsletter Subscription',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f1e8;
            }
            .header {
              background-color: #1f3529;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .email-box {
              background-color: #f9f9f9;
              padding: 15px;
              border-left: 3px solid #1f3529;
              border-radius: 4px;
              margin: 20px 0;
              font-size: 16px;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🎉 New Newsletter Subscription!</h1>
            </div>
            <div class="content">
              <p>Great news! Someone just subscribed to your newsletter.</p>

              <div class="email-box">
                📧 ${email}
              </div>

              <p style="color: #666; margin-top: 20px;">
                <strong>Subscribed at:</strong> ${new Date().toLocaleString()}
              </p>

              <div class="footer">
                <p>This notification was sent from your PublishType newsletter system.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error('Newsletter notification error:', error)
    throw error
  }
}

export async function sendContactEmail(data: ContactEmailData) {
  try {
    const { name, email, subject, message } = data

    // Email to admin
    const adminEmail = await resend.emails.send({
      from: 'PublishType Contact <onboarding@resend.dev>', // You'll replace this with your domain
      to: [process.env.ADMIN_EMAIL || 'your-email@example.com'], // Your email
      subject: `New Contact Form: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f1e8;
            }
            .header {
              background-color: #1f3529;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .field {
              margin-bottom: 20px;
            }
            .label {
              font-weight: bold;
              color: #1f3529;
              display: block;
              margin-bottom: 5px;
            }
            .value {
              color: #333;
              padding: 10px;
              background-color: #f9f9f9;
              border-left: 3px solid #1f3529;
              border-radius: 4px;
            }
            .message-box {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 4px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
            .reply-button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 24px;
              background-color: #1f3529;
              color: white;
              text-decoration: none;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">New Contact Form Submission</h1>
            </div>
            <div class="content">
              <p style="color: #666; margin-bottom: 25px;">
                You have received a new message from your website contact form.
              </p>

              <div class="field">
                <span class="label">From:</span>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <span class="label">Email:</span>
                <div class="value">
                  <a href="mailto:${email}" style="color: #1f3529;">${email}</a>
                </div>
              </div>

              <div class="field">
                <span class="label">Subject:</span>
                <div class="value">${subject}</div>
              </div>

              <div class="field">
                <span class="label">Message:</span>
                <div class="message-box">${message}</div>
              </div>

              <div style="text-align: center;">
                <a href="mailto:${email}" class="reply-button">
                  Reply to ${name}
                </a>
              </div>

              <div class="footer">
                <p>This email was sent from your PublishType contact form.</p>
                <p>Received at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // Auto-reply to user
    const userEmail = await resend.emails.send({
      from: 'PublishType <onboarding@resend.dev>', // You'll replace this with your domain
      to: [email],
      subject: `We received your message - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f1e8;
            }
            .header {
              background-color: #1f3529;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
              color: #666;
              font-size: 12px;
            }
            .message-copy {
              background-color: #f9f9f9;
              padding: 15px;
              border-left: 3px solid #1f3529;
              border-radius: 4px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Hi ${name},</p>

              <p>Thank you for reaching out to PublishType. We have received your message and will get back to you as soon as possible, typically within 24 hours during business days.</p>

              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your inquiry</li>
                <li>You'll receive a personalized response via email</li>
                <li>We aim to respond within 24 hours on business days</li>
              </ul>

              <div class="message-copy">
                <p style="margin: 0 0 10px 0;"><strong>Your message:</strong></p>
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <p style="margin-top: 25px;">If you have any urgent questions, feel free to email us directly at
                <a href="mailto:support@publishtype.com" style="color: #1f3529;">support@publishtype.com</a>
              </p>

              <div class="footer">
                <p><strong>PublishType</strong> - AI-Powered Blog Publishing Platform</p>
                <p style="margin-top: 10px;">
                  <a href="https://yourwebsite.com" style="color: #1f3529; text-decoration: none;">Visit Website</a> |
                  <a href="https://yourwebsite.com/help" style="color: #1f3529; text-decoration: none;">Help Center</a> |
                  <a href="https://yourwebsite.com/docs" style="color: #1f3529; text-decoration: none;">Documentation</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, adminEmail, userEmail }
  } catch (error) {
    console.error('Email sending error:', error)
    throw error
  }
}
