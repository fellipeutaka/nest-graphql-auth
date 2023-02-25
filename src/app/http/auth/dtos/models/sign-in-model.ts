import { Field, ObjectType } from "@nestjs/graphql";

import { UserModel } from "@app/app/http/user/dtos/models/user.model";

@ObjectType()
export class SignInModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  user: UserModel;
}
