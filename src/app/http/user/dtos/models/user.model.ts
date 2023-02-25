import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id: string;

  @Field()
  username: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  createdAt: Date;
}
