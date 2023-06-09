import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("fullName").isLength({ min: 4 }),
  body("avatarUrl").optional().isURL(),
];

export const loginRegistration = [body("email").isEmail()];
