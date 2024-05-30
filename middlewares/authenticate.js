import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw HttpError(401);
    }

    const { SECRET_KEY } = process.env;

    try {
      const { id } = jwt.verify(token, SECRET_KEY);
      const user = await User.findById(id);

      if (!user || !user.token || user.token !== token) {
        throw HttpError(401);
      }

      req.user = user;

      next();
    } catch (error) {
      throw HttpError(401);
    }
  } catch (error) {
    next(error);
  }
};