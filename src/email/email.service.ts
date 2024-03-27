import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, text: string, html: string) {
    await this.mailerService.sendMail({
      to,
      subject,
      text,
      html,
    });
  }
}
