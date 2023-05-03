import { body } from "express-validator";

export const productLibValidator = [
  body("name").optional().isString(),
  body("products").isArray(),
  body("avatarUrl").optional().isURL(),
];
