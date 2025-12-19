import { validationResult } from "express-validator";

export const validateRequst = (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({ error: errors.array() });
  }

  next();
};
