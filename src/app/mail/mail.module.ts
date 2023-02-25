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
    BullModule.forRoot(MailConfigKey, {}),
    BullModule.registerQueue({
      configKey: MailConfigKey,
      name: MailQueueName,
      redis: {
        host: process.env.MAIL_REDIS_HOST,
        port: Number(process.env.MAIL_REDIS_PORT),
        password: process.env.MAIL_REDIS_PASSWORD,
        maxRetriesPerRequest: 1,
      },
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1 * 60 * 1000, // 1 minute
        },
        timeout: 1000,
        removeOnFail: {
          age: 5 * 60 * 1000, // 5 minutes
        },
      },
      limiter: {
        max: 100, // 100 jobs
        duration: 1000, // 1 second
      },
      settings: {
        lockDuration: 30 * 1000, // 30 seconds
        lockRenewTime: 15 * 1000, // 15 seconds
        stalledInterval: 30 * 1000, // 30 seconds
        maxStalledCount: 3,
      },
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
