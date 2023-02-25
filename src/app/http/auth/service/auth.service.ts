import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { compare } from "bcrypt";

import { MailProducer } from "@app/app/mail/jobs/mail.producer";
import { hashData } from "@app/utils/hashData";
import { variableToString } from "@app/utils/variableToString";

import { UserService } from "../../user/service/user.service";
import {
  JWTEmailPayload,
  SendConfirmationEmailLinkProps,
  SignInProps,
  SignUpProps,
} from "../interfaces/auth.interface";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailProducer: MailProducer
  ) {}

  async signUp(props: SignUpProps) {
    const userAlreadyExists = await this.userService.findByEmail(props.email);

    if (userAlreadyExists) {
      throw new BadRequestException("User already exits");
    }

    const passwordHash = await hashData(props.password);
    const user = await this.userService.create({
      ...props,
      password: passwordHash,
    });

    const { hasEmailSentSuccessfully } = await this.sendConfirmationEmailLink({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
    });

    return { hasCreatedSuccessfully: true, hasEmailSentSuccessfully };
  }

  async signIn({ email, username, password }: SignInProps) {
    if (!email && !username) {
      throw new BadRequestException("You need to provide email or username");
    }

    const signInMethod = email
      ? variableToString({ email })
      : variableToString({ username });

    const user = email
      ? await this.userService.findByEmail(email)
      : await this.userService.findByUsername(username ?? "");

    const passwordMatches = await compare(password, user?.password ?? "");

    if (!user || !passwordMatches) {
      throw new BadRequestException(`Incorrect ${signInMethod} or password`);
    }

    if (!user.emailVerifiedAt) {
      throw new ForbiddenException("Email not verified");
    }

    const { accessToken, refreshToken } = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async signOut(userId: string) {
    try {
      await this.userService.updateById(userId, { refreshToken: null });
      return { hasSignOutSuccessfully: true };
    } catch (err) {
      console.error(err);
      return { hasSignOutSuccessfully: false };
    }
  }

  async confirmEmail(emailToken: string) {
    const { sub, exp } = await this.jwtService.verifyAsync<JWTEmailPayload>(
      emailToken,
      { secret: process.env.MAIL_JWT_SECRET }
    );

    if (exp < Date.now() / 1000) {
      throw new BadRequestException("Expired token");
    }

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new BadRequestException("User does not exits");
    }

    if (user.emailVerifiedAt) {
      throw new BadRequestException("User already confirmed");
    }

    await this.userService.updateById(user.id, {
      emailVerifiedAt: new Date(),
    });

    return { hasConfirmedSuccessfully: true };
  }

  async sendConfirmationEmailLink({
    email,
    fullName,
    userId,
  }: SendConfirmationEmailLinkProps) {
    const emailToken = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: process.env.MAIL_JWT_SECRET,
        expiresIn: "30m",
      }
    );

    try {
      await this.mailProducer.send({
        to: email,
        subject: "🎉 Welcome to Nest GraphQL Auth!",
        template: "confirmation",
        context: {
          emailToken,
          fullName,
        },
      });
      return { hasEmailSentSuccessfully: true };
    } catch (err) {
      console.error(err);
      return { hasEmailSentSuccessfully: false };
    }
  }

  async getTokens(userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.AUTH_JWT_ACCESS_SECRET,
          expiresIn: process.env.AUTH_JWT_ACCESS_EXPIRES_IN ?? "30m",
        }
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
        },
        {
          secret: process.env.AUTH_JWT_REFRESH_SECRET,
          expiresIn: process.env.AUTH_JWT_REFRESH_EXPIRES_IN ?? "1d",
        }
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException("Access Denied");
    }

    const refreshTokenMatches = await compare(refreshToken, user.refreshToken);
    if (!refreshTokenMatches) {
      throw new ForbiddenException("Access Denied");
    }
    const tokens = await this.getTokens(user.id);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await hashData(refreshToken);

    await this.userService.updateById(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
