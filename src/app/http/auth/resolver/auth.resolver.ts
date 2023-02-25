import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";

import { CurrentUser } from "@app/decorators/currentUser";

import { SignInInput } from "../dtos/inputs/sign-in-input";
import { SignUpInput } from "../dtos/inputs/sign-up-input";
import { SignInModel } from "../dtos/models/sign-in-model";
import { TokensModel } from "../dtos/models/tokens-model";
import { AccessTokenGuard } from "../guards/accessToken.guard";
import { RefreshTokenGuard } from "../guards/refreshToken.guard";
import type { JwtPayload } from "../interfaces/auth.interface";
import { AuthService } from "../service/auth.service";

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  async signUp(@Args("data") data: SignUpInput) {
    const { hasCreatedSuccessfully } = await this.authService.signUp(data);
    return hasCreatedSuccessfully;
  }

  @Mutation(() => SignInModel)
  async signIn(@Args("data") data: SignInInput) {
    const user = await this.authService.signIn(data);
    return user;
  }

  @UseGuards(AccessTokenGuard)
  @Mutation(() => Boolean)
  async signOut(@CurrentUser() user: JwtPayload) {
    const { hasSignOutSuccessfully } = await this.authService.signOut(user.sub);
    return hasSignOutSuccessfully;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Args("token") token: string) {
    const { hasConfirmedSuccessfully } = await this.authService.confirmEmail(
      token
    );
    return hasConfirmedSuccessfully;
  }

  @UseGuards(RefreshTokenGuard)
  @Query(() => TokensModel)
  async tokens(@CurrentUser() user: JwtPayload) {
    const tokens = await this.authService.refreshTokens(
      user.sub,
      user.refreshToken
    );
    return tokens;
  }
}
