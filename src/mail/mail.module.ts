import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { mailConfig } from './mail.config';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRoot(mailConfig)],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailerModule, MailService],
})
export class MailModule {}
