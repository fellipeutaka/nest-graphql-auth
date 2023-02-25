import { hash } from "bcrypt";

export async function hashData(data: string) {
  return await hash(data, Number(process.env.AUTH_SALT_ROUNDS ?? 8));
}
