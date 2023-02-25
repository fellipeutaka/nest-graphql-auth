import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HttpModule } from "./app/http/http.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === "production" ? ".env.production" : ".env",
    }),
    HttpModule,
  ],
})
export class AppModule {}
