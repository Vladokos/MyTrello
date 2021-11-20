const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("./config/database").connect();
const dataUsers = require("./model/user");

const app = express();
const jsonParser = express.json();

const generateAccessToken = (user_id, email) => {
  const payload = {
    user_id,
    email,
  };

  return jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "2h" });
};

const generateResetPasswordToken = (user_id, email) => {
  const payload = {
    user_id,
    email,
  };

  return jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "30m" });
};

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "t7estes@yandex.ru",
    pass: "bmjninkovzefmdbu",
  },
});

app.post("/reg", jsonParser, async (req, res) => {
  try {
    const { email, name, password } = req.body;

    const oldUser = await dataUsers.findOne({ email });

    if (oldUser) {
      return res.status(409).json({ message: "Exists" });
    }

    const encryptPassword = await bcrypt.hash(password, 12);

    const information = await new dataUsers({
      email: email.toLowerCase(),
      name,
      password: encryptPassword,
    });

    const token = generateAccessToken(information._id, email);

    information.token = token;

    transporter.sendMail(
      {
        from: "MyTrello <t7estes@yandex.ru>",
        to: email,
        subject: "Thank you for registering",
        text: "Thank you for registering on my service",
      },
      (err, info) => {
        if (err) return console.log(err);
        return console.log(info);
      }
    );

    information.save((err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      return res.status(201).json({ information });
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/sig", jsonParser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await dataUsers.findOne({ email });

    const decryptPassword = await bcrypt.compare(password, user.password);

    if (user && decryptPassword) {
      const token = generateAccessToken(user._id, email);

      user.token = token;

      user.save((err) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
      });
      return res.status(200).json({ user });
    }

    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
  }
});
// need change this
app.post("/forg", jsonParser, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await dataUsers.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const token = generateAccessToken(user._id, email);

    user.token = token;

    user.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
    });

    // need generate token to reset password link
    transporter.sendMail({
      from: "MyTrello <t7estes@yandex.ru>",
      to: email,
      subject: "your data",
      text:
        "link to reset your password\n " +
        "http://localhost:3000/" +
        user.token +
        "/reset/",
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

// need change this
// for test
app.post("/welcome", jsonParser, async (req, res) => {
  try {
    const { id } = req.body;

    const { token } = await dataUsers.findOne({ _id: id });

    if (!token) return res.status(404).json({ message: "User not found" });

    const decode = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(decode);
    res.status(200).send("Welcome");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

// it's working

app.listen(5000, () => {
  console.log("Server is running");
});
