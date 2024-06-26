import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.number().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
}).min(1);

export const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

