import { HttpError } from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const { SECRET_KEY } = process.env;

export const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  res.json({
    user:{
      email: newUser.email,
      password: newUser.password
    }
  });
};
export const login = async (req, res) => {
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "2 days" });
  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};



export const logout = async (req, res) => {
  const { _id: id } = req.user;
  const user = await User.findById(id);

  if (!user) {
    throw HttpError(401);
  }

  await User.findByIdAndUpdate(id, { token: null });

  res.status(204).json();
};

export const current = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

export const updateSubscription = async (req, res) => {
  const { id } = req.params;
  const { subscription } = req.body;

  console.log(subscription);

  const user = await User.findByIdAndUpdate(id, { subscription });

  if (!user) {
    throw HttpError(404, "User not found");
  } else if (subscription === user.subscription) {
    throw HttpError(409, "User already have this subscription");
  }

  res.json({
    message: "Subscription updated",
  });
}; 

