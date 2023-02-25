import { ISendMailOptions } from "@nestjs-modules/mailer";
import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";

import { MailQueueName, MailJobName } from "../constants/names";

@Injectable()
export class MailProducer {
  constructor(@InjectQueue(MailQueueName) private queue: Queue) {}

  async send(props: ISendMailOptions) {
    await this.queue.add(MailJobName, props);
  }
}
