import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { MailConfigKey, MailQueueName } from "./constants/names";
import { MailConsumer } from "./jobs/mail.consumer";
import { MailProducer } from "./jobs/mail.producer";
import { MailService } from "./mail.service";

@Module({
  imports: [
    BullModule.forRoot(MailConfigKey, {
      redis: {
        host: process.env.MAIL_REDIS_HOST,
        port: Number(process.env.MAIL_REDIS_PORT),
        password: process.env.MAIL_REDIS_PASSWORD,
      },
    }),
    BullModule.registerQueue({
      configKey: MailConfigKey,
      name: MailQueueName,
    }),
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_USER,
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService, MailProducer, MailConsumer],
  exports: [MailProducer],
})
export class MailModule {}
