import { Module } from "@nestjs/common";

import { PrismaModule } from "@app/app/database/prisma.module";

import { UsersResolver } from "../resolver/user.resolver";
import { UserService } from "../service/user.service";

@Module({
  imports: [PrismaModule],
  providers: [UsersResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
