const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verifyToken = require("./middleware/verifyToken");

require("./config/database").connect();
const dataUsers = require("./model/user");
const dataBoards = require("./model/boards");

const app = express();
const jsonParser = express.json();

const generateAccessToken = (user_id, email) => {
  const payload = {
    user_id,
    email,
  };

  return jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: "1h" });
};

const generateResetPasswordToken = (user_id, name, email) => {
  const payload = {
    user_id,
    name,
    email,
  };

  return jwt.sign(payload, process.env.RESETTOKEN_KEY, { expiresIn: "30m" });
};

const generateRefreshToken = (user_id, email) => {
  const payload = {
    user_id,
    email,
  };

  return jwt.sign(payload, process.env.REFRESHTOKEN_KEY, { expiresIn: "15d" });
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

app.post("/form/oldUser", jsonParser, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    jwt.verify(refreshToken, process.env.REFRESHTOKEN_KEY);

    const data = await dataUsers.findOne({ refreshToken });

    if (!data) return res.sendStatus(400);

    data.token = generateAccessToken(data._id, data.email);
    data.refreshToken = generateRefreshToken(data._id, data.email);

    data.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }

      return res.status(200).json({
        id: data.id,
        refreshToken: data.refreshToken,
        accessToken: data.token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.post("/form/registration/newUser", jsonParser, async (req, res) => {
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
    const refreshToken = generateRefreshToken(information._id, email);

    information.token = token;
    information.refreshToken = refreshToken;

    transporter.sendMail(
      {
        from: "MyTrello <t7estes@yandex.ru>",
        to: email,
        subject: "Thank you for registering",
        text: "Thank you for registering on my service",
      },
      (error, info) => {
        if (error) return console.log(error);
        return console.log(info);
      }
    );

    information.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }

      return res
        .status(201)
        .json({ id: information.id, refreshToken, accessToken: token });
    });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.post("/form/signIn", jsonParser, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await dataUsers.findOne({ email });

    const decryptPassword = await bcrypt.compare(password, user.password);

    if (user && decryptPassword) {
      const token = generateAccessToken(user._id, email);
      const refreshToken = generateRefreshToken(user._id, email);

      user.token = token;
      user.refreshToken = refreshToken;

      user.save((error) => {
        if (error) {
          console.log(error);
          return res.sendStatus(500);
        }
      });
      return res
        .status(200)
        .json({ id: user.id, refreshToken, accessToken: token });
    }

    return res.sendStatus(400);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.post("/form/password/forgot", jsonParser, async (req, res) => {
  try {
    const { email, name } = req.body;

    const user = await dataUsers.findOne({ email, name });

    if (!user) return res.status(400).json({ message: "User not found" });

    const resetToken = generateResetPasswordToken(user._id, name, email);

    user.resetToken = resetToken;

    user.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
    });

    transporter.sendMail({
      from: "MyTrello <t7estes@yandex.ru>",
      to: email,
      subject: "your data",
      text:
        "link to reset your password\n you have 30 minutes\n " +
        "http://localhost:3000/" +
        user.resetToken +
        "/reset/",
    });

    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.post(
  "/form/password/reset/token/validate",
  jsonParser,
  async (req, res) => {
    try {
      const { token } = req.body;

      const { resetToken } = await dataUsers.findOne({ resetToken: token });

      if (!resetToken)
        return res.status(404).json({ message: "User not found" });

      res.status(200).send("Valid");
    } catch (error) {
      console.log(error);
      res.status(400).send("Error");
    }
  }
);

app.post("/form/password/reset", jsonParser, async (req, res) => {
  try {
    const { token, password } = req.body;

    const data = await dataUsers.findOne({ resetToken: token });

    if (!data) return res.status(404).json({ message: "User not found" });

    const decryptPassword = await bcrypt.compare(password, data.password);

    if (decryptPassword) {
      return res.status(400).send({ message: "Need another password" });
    }

    const encryptPassword = await bcrypt.hash(password, 12);

    const newToken = generateAccessToken(data._id, data.email);
    const refreshToken = generateRefreshToken(data._id, data.email);

    data.password = encryptPassword;
    data.resetToken = null;
    data.token = newToken;
    data.refreshToken = refreshToken;

    data.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
    });

    res.status(200).send({ message: "successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});
// change the link request
app.post("/token/verify", jsonParser, async (req, res) => {
  try {
    const { id, accessToken } = req.body;

    var data = await dataUsers.findOne({ _id: id, accessToken });

    if (!data) return res.status(400).send("Error");
    // maybe need generate new access and refresh token
    jwt.verify(accessToken, process.env.TOKEN_KEY);

    return res.status(200).send({ message: "successfully" });
  } catch (error) {
    if (error.message === "jwt expired" || error.name === "TokenExpiredError") {
      const { refreshToken } = data;

      jwt.verify(refreshToken, process.env.REFRESHTOKEN_KEY, (error) => {
        if (error) return error;
      });
      
      const newToken = generateAccessToken(data._id, data.email);
      const newRefreshToken = generateRefreshToken(data._id, data.email);

      data.token = newToken;
      data.refreshToken = newRefreshToken;

      data.save((error) => {
        if (error) {
          console.log(error);
          return res.sendStatus(500);
        }
      });
      return res.status(200).send({ message: "successfully" });
    }

    res.status(400).send("Error");
  }
});

app.get("/boards/:id/all", async (req, res) => {
  try {
    const idUser = req.params.id;
    const boardsData = await dataBoards.find({
      idUser,
    });

    if (!boardsData) return res.status(400).send("Error");

    return res.status(200).send(boardsData);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.post("/boards/create", jsonParser, async (req, res) => {
  try {
    const { nameBoard, idUser } = req.body;

    const newBoard = await new dataBoards({
      nameBoard,
      idUser,
    });

    newBoard.save((error) => {
      if (error) {
        console.log(error);
        return res.sendStatus(500);
      }
    });

    res.status(200).send(newBoard);
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});

app.listen(5000, () => {
  console.log("Server is running");
});
