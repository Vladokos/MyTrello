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
    password: String,
  },
  { versionKey: false }
);

const transporter = nodemailer.createTransport({
  host: "smtp.mail.ru",
  port: 465,
  secure: true,
  auth: {
    user: "testmailnode@mail.ru",
    pass: "wrx3eM96NDKAfnpFq810",
  },
});

const dataUsers = mongoose.model("DataUser", dataUsersSchema);

mongoose.connect("mongodb://localhost:27017/dataUsers", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.post("/reg", jsonParser, (req, res) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;

  dataUsers.findOne({ email: email }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (doc) return res.send("Exists");

    const data = new dataUsers({
      email: email,
      name: name,
      password: password,
    });

    transporter.sendMail(
      {
        from: "MyTrello <testmailnode@mail.ru>",
        to: email,
        subject: "Thank you for registering",
        text: "Thank you for registering on my service",
      },
      (err, info) => {
        if (err) return console.log(err);
        return console.log(info);
      }
    );

    data.save((err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    });
  });
});

app.post("/sig", jsonParser, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  dataUsers.findOne({ email: email, password: password }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (doc != null) {
      return res.sendStatus(200);
    }
    return res.sendStatus(400);
  });
});

app.post("/forg", jsonParser, (req, res) => {
  const email = req.body.email;

  dataUsers.findOne({ email: email }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (doc != null) {
      // need send reset password link
      transporter.sendMail({
        from: "MyTrello <testmailnode@mail.ru>",
        to: email,
        subject: "your data",
        text: "link to reset your password\n " + "http://localhost:3000/reset/" + doc._id,
      });
      console.log(doc);
      return res.sendStatus(200);
    }

    return res.sendStatus(400);
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
