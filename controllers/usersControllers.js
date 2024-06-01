import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Jimp from "jimp";
import path from "path";

dotenv.config();

const { SECRET_KEY } = process.env;
const avatarDir = path.resolve("public/avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email is already in use");
    }

    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });
    res.json({
      name: newUser.name,
      email: newUser.email,
      
    });
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { _id: id } = req.user;

    await User.findByIdAndUpdate(id, { token: null }, { new: true });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;

    res.json({
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subscription } = req.body;

    const user = await User.findById(id);
    user.subscription = subscription;
    await user.save();

    res.json({
      message: "Subscription updated",
      email: user.email,
      subscription: `Now subscription is ${subscription}`,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { path: filePath } = req.file;
    const img = await Jimp.read(filePath);
    img.resize(250, 250).write(filePath);

    const result = avatarDir + "/" + req.file.filename;
    await fstat.rename(filePath, result);
    const avatarUrl = `/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { avatarUrl });
    res.json({ avatarUrl });
  } catch (error) {
    next(error);
  }
};