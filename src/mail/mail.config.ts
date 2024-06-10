import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { config } from 'src/config';

export const mailConfig: MailerOptions = {
  transport: {
    host: config.EMAIL.HOST,
    port: config.EMAIL.PORT,
    secure: false,
    auth: {
      user: config.EMAIL.USER,
      pass: config.EMAIL.PASSWORD,
    },
  },
  defaults: {
    from: '"No Reply" <no-reply@localhost>',
  },
  preview: true,
  template: {
    dir: process.cwd() + '/templates/',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
