import { Field, InputType } from "@nestjs/graphql";

import { IsNotBlank } from "@app/decorators/isNotBlank";

@InputType()
export class ChangeUsernameInput {
  @Field(() => String)
  @IsNotBlank()
  username: string;
}
