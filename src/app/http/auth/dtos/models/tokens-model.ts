import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TokensModel {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
