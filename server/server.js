const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();

const dataUsersSchema = new Schema(
  {
    email: String,
    name: String,
    password: Number,
  },
  { versionKey: false }
);

const dataUsers = mongoose.model("DataUser", dataUsersSchema);

mongoose.connect("mongodb://localhost:27017/dataUsers", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.post("/reg", jsonParser, (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "tt0356617@gmail.com",
      pass: "123qwerasdzX",
    },
  });

  dataUsers.findOne({ email: email }, (err, doc) => {
    if (err) return res.sendStatus(500);
    if (doc) return res.send("Exists");

    const data = new dataUsers({
      email: email,
      name: name,
      password: password,
    });

    let result = transporter.sendMail({
      from: "Test <tt0356617@gmail.com>",
      to: "vladnothepaver@gmail.com",
      subject: "Message title",
      text: "Plaintext version of the message",
      html: "<p>HTML version of the message</p>",
    });

    console.log(result);

    data.save((err) => {
      if (err) {
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    });
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
