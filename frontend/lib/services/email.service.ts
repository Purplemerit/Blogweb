import * as nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    // Only initialize if SMTP credentials are provided
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
    }
  }

  async sendVerificationEmail(email: string, token: string) {
    if (!this.transporter) {
      console.log('📧 Email not configured. Verification link:');
      console.log(`${process.env.APP_URL}/verify-email?token=${token}`);
      return { success: false, message: 'Email service not configured' };
    }

    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@localhost',
        to: email,
        subject: 'Verify your email address',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #1f3529; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Publish Type</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #1f3529; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email Address</h2>
                        <p style="color: #666666; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
                          Thank you for signing up! Please click the button below to verify your email address and activate your account.
                        </p>

                        <!-- Button -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background-color: #1f3529; border-radius: 6px; text-align: center;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; margin: 20px 0 0 0; line-height: 1.6; font-size: 14px;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #1f3529; margin: 10px 0 0 0; word-break: break-all; font-size: 14px;">
                          ${verificationUrl}
                        </p>

                        <p style="color: #999999; margin: 30px 0 0 0; line-height: 1.6; font-size: 12px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                          This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9f9f9; padding: 20px; text-align: center;">
                        <p style="color: #999999; margin: 0; font-size: 12px;">
                          © 2024 Publish Type. All rights reserved.
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
      });

      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    if (!this.transporter) {
      console.log('📧 Email not configured. Password reset link:');
      console.log(`${process.env.APP_URL}/reset-password?token=${token}`);
      return { success: false, message: 'Email service not configured' };
    }

    const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@localhost',
        to: email,
        subject: 'Reset your password',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #1f3529; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Publish Type</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #1f3529; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
                        <p style="color: #666666; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
                          We received a request to reset your password. Click the button below to create a new password.
                        </p>

                        <!-- Button -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background-color: #1f3529; border-radius: 6px; text-align: center;">
                              <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; margin: 20px 0 0 0; line-height: 1.6; font-size: 14px;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #1f3529; margin: 10px 0 0 0; word-break: break-all; font-size: 14px;">
                          ${resetUrl}
                        </p>

                        <p style="color: #999999; margin: 30px 0 0 0; line-height: 1.6; font-size: 12px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9f9f9; padding: 20px; text-align: center;">
                        <p style="color: #999999; margin: 0; font-size: 12px;">
                          © 2024 Publish Type. All rights reserved.
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
      });

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }

  async sendCollaborationInvite(email: string, inviterName: string, articleTitle: string, role: string, isRegistered: boolean) {
    const inviteUrl = isRegistered
      ? `${process.env.APP_URL}/dashboard/team`
      : `${process.env.APP_URL}/signup?invite=true&email=${encodeURIComponent(email)}`;

    if (!this.transporter) {
      console.log('📧 Email not configured. Collaboration invite link:');
      console.log(`To: ${email}`);
      console.log(`From: ${inviterName}`);
      console.log(`Article: ${articleTitle}`);
      console.log(`Role: ${role}`);
      console.log(`Link: ${inviteUrl}`);
      return { success: false, message: 'Email service not configured' };
    }

    const roleDescription = role === 'VIEWER' ? 'view' : role === 'COMMENTER' ? 'view and comment on' : 'edit';

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@localhost',
        to: email,
        subject: `${inviterName} invited you to collaborate on "${articleTitle}"`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Collaboration Invitation</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #1f3529; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Publish Type</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="color: #1f3529; margin: 0 0 20px 0; font-size: 24px;">You've Been Invited to Collaborate!</h2>
                        <p style="color: #666666; margin: 0 0 20px 0; line-height: 1.6; font-size: 16px;">
                          <strong style="color: #1f3529;">${inviterName}</strong> has invited you to ${roleDescription} the article:
                        </p>

                        <div style="background-color: #f9f9f9; border-left: 4px solid #1f3529; padding: 16px; margin: 20px 0;">
                          <p style="color: #1f3529; margin: 0; font-size: 18px; font-weight: 600;">
                            ${articleTitle}
                          </p>
                        </div>

                        <p style="color: #666666; margin: 20px 0; line-height: 1.6; font-size: 16px;">
                          Your role: <strong style="color: #1f3529;">${role}</strong>
                        </p>

                        ${!isRegistered ? `
                          <p style="color: #666666; margin: 20px 0; line-height: 1.6; font-size: 14px; background-color: #fff3cd; padding: 12px; border-radius: 6px; border-left: 4px solid #ffc107;">
                            You'll need to create a free account to start collaborating. Click the button below to get started!
                          </p>
                        ` : ''}

                        <!-- Button -->
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                          <tr>
                            <td style="background-color: #1f3529; border-radius: 6px; text-align: center;">
                              <a href="${inviteUrl}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                                ${isRegistered ? 'View Invitation' : 'Create Account & Join'}
                              </a>
                            </td>
                          </tr>
                        </table>

                        <p style="color: #666666; margin: 20px 0 0 0; line-height: 1.6; font-size: 14px;">
                          Or copy and paste this link into your browser:
                        </p>
                        <p style="color: #1f3529; margin: 10px 0 0 0; word-break: break-all; font-size: 14px;">
                          ${inviteUrl}
                        </p>

                        <p style="color: #999999; margin: 30px 0 0 0; line-height: 1.6; font-size: 12px; border-top: 1px solid #eeeeee; padding-top: 20px;">
                          This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9f9f9; padding: 20px; text-align: center;">
                        <p style="color: #999999; margin: 0; font-size: 12px;">
                          © 2024 Publish Type. All rights reserved.
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
      });

      return { success: true, message: 'Collaboration invitation sent' };
    } catch (error) {
      console.error('Failed to send collaboration invitation:', error);
      return { success: false, message: 'Failed to send email' };
    }
  }
}

export const emailService = new EmailService();
