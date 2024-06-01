import express from "express";
import { validateBody } from "../middlewares/validateBody.js";
import { schemas } from "../models/user.js";
import { authenticate } from "../middlewares/authenticate.js";
import {
  register,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
} from "../controllers/usersControllers.js";
import { isValid } from "../middlewares/isValid.js";
import upload from "../middlewares/upload.js";

export const usersRouter = express.Router();

usersRouter.post("/register", validateBody(schemas.registerSchema), register);
usersRouter.post("/login", validateBody(schemas.loginSchema), login);
usersRouter.post("/logout", authenticate, logout);

usersRouter.get("/current", authenticate, current);

usersRouter.patch(
  "/:id/subscription",
  authenticate,
  isValid,
  validateBody(schemas.updateSubscriptionSchema),
  updateSubscription
);

usersRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);