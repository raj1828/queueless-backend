import env from "./env.js";

export const jwtConfig = {
  secret: env.JWT_ACCESS_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
};
