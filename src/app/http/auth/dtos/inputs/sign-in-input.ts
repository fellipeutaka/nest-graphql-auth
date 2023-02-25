import { Field, InputType } from "@nestjs/graphql";
import {
  IsEmail,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";

import { IsNotBlank } from "@app/decorators/isNotBlank";

import { password } from "../../constants/regex";

@InputType()
export class SignInInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNotBlank()
  username?: string;

  @Field(() => String)
  @IsNotBlank()
  @MinLength(8)
  @MaxLength(32)
  @Matches(password.regex, {
    message: password.message,
  })
  password: string;
}
