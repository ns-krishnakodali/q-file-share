import { hashSync } from "bcrypt-ts";

const SALT_LENGTH = 5;

export const hashPassword = (password: string): any => {
  return hashSync(password, SALT_LENGTH);
};
