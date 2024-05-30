import { Contact } from "../models/contact.js";

import { HttpError } from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const result = await Contact.find();
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);

  if (!result) {
    return res.status(404).json({ message: HttpError(404).message });
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    res.status(404).json({ message: HttpError(404).message });
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    res.status(404).json({ message: HttpError(404).message });
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body);
  if (!result) {
    res.status(404).json({ message: HttpError(404).message });
  }
  res.json(result);
};