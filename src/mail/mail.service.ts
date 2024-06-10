import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerSvc: MailerService) {}

  async sendEmail(receiverEmail: string, subject: string, content: string) {
    try {
      await this.mailerSvc.sendMail({
        to: receiverEmail,
        subject: subject,
        html: content,
      });
      return true; // Email sent
    } catch (error) {
      console.log('Error sending email', error);
      return false; //
    }
  }
}
