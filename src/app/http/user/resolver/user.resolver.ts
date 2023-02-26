import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@app/decorators/currentUser";
import { hashData } from "@app/utils/hashData";

import { AccessTokenGuard } from "../../auth/guards/accessToken.guard";
import type { JwtPayload } from "../../auth/interfaces/auth.interface";
import { ChangePasswordInput } from "../dtos/inputs/change-password-input";
import { ChangeUsernameInput } from "../dtos/inputs/change-username-input";
import { UserModel } from "../dtos/models/user.model";
import { UserService } from "../service/user.service";

@Resolver()
export class UsersResolver {
  constructor(private userService: UserService) {}

  @UseGuards(AccessTokenGuard)
  @Query(() => UserModel, { nullable: true })
  async me(@CurrentUser() payload: JwtPayload) {
    const user = await this.userService.findById(payload.sub);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async changeUsername(
    @CurrentUser() payload: JwtPayload,
    @Args("data") { username }: ChangeUsernameInput
  ) {
    await this.userService.updateById(payload.sub, {
      username,
    });
    return true;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async changePassword(
    @CurrentUser() payload: JwtPayload,
    @Args("data") { newPassword }: ChangePasswordInput
  ) {
    const newPasswordHashed = await hashData(newPassword);
    await this.userService.changePassword({
      userId: payload.sub,
      newPassword,
      newPasswordHashed,
    });
    return true;
  }
}
