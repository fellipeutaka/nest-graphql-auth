import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { PrismaModule } from "@app/app/database/prisma.module";
import { MailModule } from "@app/app/mail/mail.module";

import { UserModule } from "../../user/module/user.module";
import { AuthResolver } from "../resolver/auth.resolver";
import { AuthService } from "../service/auth.service";
import { AccessTokenStrategy } from "../strategies/accessToken.strategy";
import { RefreshTokenStrategy } from "../strategies/refreshToken.strategy";

@Module({
  imports: [
    JwtModule.register({
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
    PrismaModule,
    UserModule,
    PassportModule,
    MailModule,
  ],
  providers: [
    AuthResolver,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
