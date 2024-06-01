import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
const { API_KEY } = process.env;
sgMail.setApiKey(API_KEY);

export const sendEmail = async (data) => {
  const email = { ...data, from: "krylov.artem.1995@gmail.com" };
  await sgMail.send(email);
  return true;
};