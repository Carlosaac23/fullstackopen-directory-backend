const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.lsbzxli.mongodb.net/directoryApp?appName=Cluster0`;
mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Contact = mongoose.model("Contact", contactSchema);
const contactName = process.argv[3];
const contactPhone = process.argv[4];

const contact = new Contact({
  name: contactName,
  phone: contactPhone,
});

if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });

    mongoose.connection.close();
  });
} else {
  contact.save().then((result) => {
    console.log(result);
    console.log(`added ${contactName} number ${contactPhone} to phonebook`);
    mongoose.connection.close();
  });
}
