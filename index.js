const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    phone: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phone: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phone: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phone: "39-23-6423122",
  },
];

function generateId() {
  const maxId = contacts.length > 0 ? Math.max(...contacts.map((contact) => contact.id)) : 0;
  return maxId + 1;
}

app.post("/api/contacts", (req, res) => {
  const body = req.body;
  console.log("body", body);

  const contactExists = contacts.find((contact) => contact.name === body.name);

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "name or phone missing" });
  }

  if (contactExists) {
    return res.status(409).json({ error: "name must be unique" });
  }

  const contact = {
    id: generateId(),
    name: body.name,
    phone: body.phone,
  };

  contacts.concat(contact);

  return res.json(contact);
});

app.get("/api/contacts", (req, res) => {
  return res.json(contacts);
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${contacts.length} people</p> <p>${new Date()}</p>`);
});

app.get("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  const contact = contacts.find((contact) => contact.id === id);

  if (!contact) {
    return res.status(404).json({ error: "contact not found" });
  }

  return res.json(contact);
});

app.delete("/api/contacts/:id", (req, res) => {
  const id = Number(req.params.id);
  contacts = contacts.filter((contact) => contact.id !== id);

  return res.status(204).end();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
