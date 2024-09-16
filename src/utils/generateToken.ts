import jwt from "jsonwebtoken";
import { secret } from "../auth/config";

const options = {
  expiresIn: 3600,
};

export function generateToken(email: String, password: String, id: number) {
  const payload = {
    id: id,
    email: email,
    password: password,
  };

  const token = jwt.sign(payload, secret, options);

  return token;
}
