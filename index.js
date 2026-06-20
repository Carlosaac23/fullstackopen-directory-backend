const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Contact = require("./models/contact");

const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

// let contacts = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     phone: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     phone: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     phone: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     phone: "39-23-6423122",
//   },
// ];

// function generateId() {
//   const maxId = contacts.length > 0 ? Math.max(...contacts.map((contact) => contact.id)) : 0;
//   return maxId + 1;
// }

app.post("/api/contacts", (req, res) => {
  const body = req.body;

  if (!body.name || !body.phone) {
    return res.status(400).json({ error: "name or phone missing" });
  }

  const contact = new Contact({
    name: body.name,
    phone: body.phone,
  });

  contact.save().then((savedContact) => res.json(savedContact));
});

app.get("/api/contacts", (req, res) => {
  Contact.find({}).then((contacts) => res.json(contacts));
});

app.get("/info", (req, res) => {
  Contact.find({}).then((contacts) => {
    res.send(`<p>Phonebook has info for ${contacts.length} people</p> <p>${new Date()}</p>`);
  });
});

app.get("/api/contacts/:id", (req, res, next) => {
  const id = req.params.id;
  Contact.findById(id)
    .then((contact) => res.json(contact))
    .catch((error) => next(error));
});

app.put("/api/contacts/:id", (req, res, next) => {
  const id = req.params.id;
  const body = req.body;

  const contact = {
    name: body.name,
    phone: body.phone,
  };

  Contact.findByIdAndUpdate(id, contact, { new: true })
    .then((returnedContact) => res.json(returnedContact))
    .catch((error) => next(error));
});

app.delete("/api/contacts/:id", (req, res, next) => {
  const id = req.params.id;

  Contact.findByIdAndDelete(id)
    .then((result) => res.status(204).end())
    .catch((error) => next(error));
});

function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
