import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SignUpModel {
  @Field()
  hasCreatedSuccessfully: boolean;

  @Field()
  hasEmailSentSuccessfully: boolean;
}
