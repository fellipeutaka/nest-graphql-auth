import type { ISendMailOptions } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { MailQueueName, MailJobName } from "../constants/names";
import { MailService } from "../mail.service";

@Processor(MailQueueName)
export class MailConsumer {
  constructor(private mailService: MailService) {}

  @Process(MailJobName)
  async sendMailJob(job: Job<ISendMailOptions>) {
    await this.mailService.send(job.data);
  }
}
