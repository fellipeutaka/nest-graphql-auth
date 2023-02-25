import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, Matches, MaxLength, MinLength } from "class-validator";

import { IsNotBlank } from "@app/decorators/isNotBlank";

import { password } from "../../constants/regex";

@InputType()
export class SignUpInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  @IsNotBlank()
  username: string;

  @Field(() => String)
  @IsNotBlank()
  fullName: string;

  @Field(() => String)
  @IsNotBlank()
  @MinLength(8)
  @MaxLength(32)
  @Matches(password.regex, {
    message: password.message,
  })
  password: string;
}
