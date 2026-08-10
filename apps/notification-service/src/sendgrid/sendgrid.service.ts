import { Injectable } from '@nestjs/common';

@Injectable()
export class SendGridService {
  async sendEmail(to: string, subject: string, body: string) {
    console.log(`[SENDGRID MAILER] Sent email to ${to} with subject "${subject}"`);
    return { success: true, messageId: `msg_${Date.now()}` };
  }
}
