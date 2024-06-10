import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('emails')
export class MailController {
  constructor(private readonly mailSvc: MailService) {}

  @Post('send')
  async sendEmail(
    @Body() emailData: { to: string; subject: string; content: string },
  ) {
    const { to, subject, content } = emailData;
    const emailSent = await this.mailSvc.sendEmail(to, subject, content);

    if (emailSent) {
      return { message: 'Email sent successfully' };
    } else {
      return { message: 'Failed to send email' };
    }
  }
}
