export type SignUpProps = {
  email: string;
  username: string;
  fullName: string;
  password: string;
};

export type SignInProps = {
  email?: string;
  username?: string;
  password: string;
};

export type SendConfirmationEmailLinkProps = {
  userId: string;
  email: string;
  fullName: string;
};

export type ChangePasswordProps = {
  userId: string;
  newPassword: string;
};

export type JWTEmailPayload = {
  sub: string;
  iat: number;
  exp: number;
};

export type JwtPayload = {
  sub: string;
  iat: number;
  exp: number;
  refreshToken: string;
};
