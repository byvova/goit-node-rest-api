import express from "express";
import morgan from "morgan";
import cors from "cors";
import fs from "fs/promises";

const CONTACTS_FILE_PATH = "contacts.json";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    const contactsData = await fs.readFile(CONTACTS_FILE_PATH, "utf8");
    req.contacts = JSON.parse(contactsData);
    next();
  } catch (error) {
    if (error.code === 'ENOENT') {
      req.contacts = [];
      next();
    } else {
      next(error);
    }
  }
});

app.get("/", (req, res, next) => {
  res.json(req.contacts);
});

app.post("/api/contacts", async (req, res, next) => {
  try {
    const newContact = req.body;
    req.contacts.push(newContact);
    await fs.writeFile(CONTACTS_FILE_PATH, JSON.stringify(req.contacts, null, 2));
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3001, () => {
  console.log("Server is running. Use our API on port: 3001");
});
