import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async send(props: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(props);
    } catch (err) {
      console.error(err);
    }
  }
}
