const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const process = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const app = express();
const jsonParser = express.json();

const dataUsersSchema = new Schema(
  {
    email: String,
    name: String,
    password: String,
    token: String,
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

app.post("/reg", jsonParser, async (req, res) => {
  const { email, name, password } = req.body;

  const oldUser = await dataUsers.findOne({ email });

  if (oldUser) {
    return res.send("Exists").status(409);
  }

  const encryptPassword = await bcrypt.hash(password, 12);

  const data = await new dataUsers({
    email: email.toLowerCase(),
    name,
    password: encryptPassword,
  });

  const token = jwt.sign(
    {
      user_id: data._id,
      email,
    },
    "2020",
    {
      expiresIn: "1h",
    }
  );

  data.token = token;

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

    return res.json(data).status(201);
  });
});

app.post("/sig", jsonParser, async (req, res) => {
  const { email, password } = req.body;

  const user = await dataUsers.findOne({ email });

  const decryptPassword = await bcrypt.compare(password, user.password);

  if (user && decryptPassword) {
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      "2020",
      {
        expiresIn: "1h",
      }
    );

    user.token = token;

    return res.json(user).status(20);
  }

  return res.sendStatus(400);
});

app.post("/forg", jsonParser, (req, res) => {
  const { email } = req.body;

  dataUsers.findOne({ email }, (err, doc) => {
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
        text:
          "link to reset your password\n " +
          "http://localhost:3000/" +
          doc._id +
          "/reset/",
      });
      console.log(doc);
      return res.sendStatus(200);
    }

    return res.sendStatus(400);
  });
});
// for test
const auth = require("./middleware/auth");
app.post("/welcome", jsonParser, auth, (req, res) => {
  console.log("test2");
  res.status(200).send("Welcome 🙌 ");
});
// it's working 

app.listen(5000, () => {
  console.log("Server is running");
});
