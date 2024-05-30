import express from "express";
import fs from "fs";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/contacts", (req, res) => {
  try {
    const contacts = JSON.parse(fs.readFileSync("contacts.json", "utf-8"));
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});


app.post("/contacts", (req, res) => {
  try {

    const contacts = JSON.parse(fs.readFileSync("contacts.json", "utf-8"));
    const newContact = req.body;

    contacts.push(newContact);
    

    fs.writeFileSync("contacts.json", JSON.stringify(contacts, null, 2));
    
    res.json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
