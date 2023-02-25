import { Field, InputType } from "@nestjs/graphql";
import { Matches, MaxLength, MinLength } from "class-validator";

import { password } from "@app/app/http/auth/constants/regex";
import { IsNotBlank } from "@app/decorators/isNotBlank";

@InputType()
export class ChangePasswordInput {
  @Field(() => String)
  @IsNotBlank()
  @MinLength(8)
  @MaxLength(32)
  @Matches(password.regex, {
    message: password.message,
  })
  newPassword: string;
}
