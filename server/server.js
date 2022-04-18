const express = require("express");
const app = express();

const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const wss = require("express-ws")(app);
const aWss = wss.getWss();

const verifyToken = require("./middleware/verifyToken");

require("./config/database").connect();
const dataUsers = require("./model/user");
const dataBoards = require("./model/boards");
const dataList = require("./model/list");
const dataCard = require("./model/card");
const { json } = require("express");

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
    user: "sd5df.f.sdsdf@yandex.ru",
    pass: "ckagqjyxprmfbhfk",
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

    await data.save();

    return res.status(200).json({
      refreshToken: data.refreshToken,
      accessToken: data.token,
      userName: data.name,
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
        from: "MyTrello <sd5df.f.sdsdf@yandex.ru>",
        to: email,
        subject: "Thank you for registering",
        text: "Thank you for registering on my service",
      },
      (error, info) => {
        if (error) return console.log(error);
        return console.log(info);
      }
    );

    await information.save();

    return res
      .status(201)
      .json({ userName: data.name, refreshToken, accessToken: token });
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

      await user.save();

      return res
        .status(200)
        .json({ userName: user.name, refreshToken, accessToken: token });
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

    await user.save();

    transporter.sendMail({
      from: "MyTrello <sd5df.f.sdsdf@yandex.ru>",
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

    await data.save();

    res.status(200).send({ message: "successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Error");
  }
});
// change the link request
app.post("/token/verify", jsonParser, async (req, res) => {
  try {
    const { accessToken } = req.body;

    const { user_id } = jwt.decode(accessToken, process.env.TOKEN_KEY);

    var data = await dataUsers.findById(user_id);

    if (!data) return res.status(400).send("Error");
    // maybe need generate new access and refresh token
    jwt.verify(accessToken, process.env.TOKEN_KEY);

    const idUser = data._id;
    const userName = data.name;

    return res.status(200).send({ idUser, userName });
  } catch (error) {
    if (error.message === "jwt expired" || error.name === "TokenExpiredError") {
      const { refreshToken } = data;
      const idUser = data._id;

      jwt.verify(refreshToken, process.env.REFRESHTOKEN_KEY, (error) => {
        if (error) return error;
      });

      const newToken = generateAccessToken(idUser, data.email);
      const newRefreshToken = generateRefreshToken(idUser, data.email);

      data.token = newToken;
      data.refreshToken = newRefreshToken;

      await data.save();

      return res.status(200).send({ newToken, idUser });
    } else {
      res.status(400).send("Error");
    }
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
app.get("/boards/:id/one", async (req, res) => {
  try {
    const boardId = req.params.id;

    const boardData = await dataBoards.findById(boardId);

    if (!boardData) return res.status(400).send("Error");

    return res.status(200).send(boardData);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/boards/create", jsonParser, async (req, res) => {
  try {
    const { nameBoard, idUser } = req.body;

    const newBoard = await new dataBoards({
      nameBoard,
      idUser,
      favorites: false,
      lastVisiting: null,
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
    return res.status(400).send("Error");
  }
});

app.post("/board/addFavorites", jsonParser, async (req, res) => {
  try {
    const { boardId } = req.body;

    const board = await dataBoards.findById(boardId);

    if (!board) return res.status(400).send("Error");

    board.favorites = true;

    await board.save();

    res.status(200).send({ boardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});
app.post("/board/removeFavorites", jsonParser, async (req, res) => {
  try {
    const { boardId } = req.body;

    const board = await dataBoards.findById(boardId);

    if (!board) return res.status(400).send("Error");

    board.favorites = false;

    await board.save();

    res.status(200).send({ boardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/changeData", jsonParser, async (req, res) => {
  try {
    const { boardId, date } = req.body;

    const board = await dataBoards.findById(boardId);

    if (!board) return res.status(400).send("Error");

    board.lastVisiting = date;

    await board.save();

    res.status(200).send({ boardId, date });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/lists/get", jsonParser, async (req, res) => {
  try {
    const { boardId } = req.body;

    const listsData = await dataList.find({ boardId });

    if (!listsData) return res.status(400).send("Error");

    return res.status(200).send(listsData);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/create", jsonParser, async (req, res) => {
  try {
    const { nameList, boardId } = req.body;

    const newList = await new dataList({
      nameList,
      boardId,
      archived: false,
    });

    const list = await newList.save();

    const board = await dataBoards.findById(boardId);
    board.lists.push(list);

    await board.save();

    return res.status(200).send(list);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/move", jsonParser, async (req, res) => {
  try {
    const { position, boardId, currentListId } = req.body;

    const board = await dataBoards.findById(boardId);

    board.lists.splice(board.lists.indexOf(currentListId), 1);
    board.lists.splice(position, 0, currentListId);

    await board.save();

    return res.status(200).send(board);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/get", jsonParser, async (req, res) => {
  try {
    const { boardId } = req.body;

    const cardData = await dataCard.find({ boardId });

    if (!cardData) return res.status(400).send("Error");

    return res.status(200).send(cardData);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/create", jsonParser, async (req, res) => {
  try {
    const { nameCard, boardId, listId } = req.body;

    const newCard = await new dataCard({
      nameCard,
      descriptionCard: "",
      boardId,
      archived: false,
    });

    const card = await newCard.save();

    const list = await dataList.findById(listId);
    list.cards.push(card);

    await list.save();

    return res.status(200).send(card);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});
// change
app.post("/board/list/card/move", jsonParser, async (req, res) => {
  try {
    const { fromListId, toListId, position, cardId } = req.body;

    if (fromListId === toListId) {
      const oldList = await dataList.findById(fromListId);

      oldList.cards.splice(oldList.cards.indexOf(cardId), 1);
      oldList.cards.splice(position, 0, cardId);

      await oldList.save();

      return res.status(200).send({ oldList });
    } else {
      const oldList = await dataList.findById(fromListId);
      const newList = await dataList.findById(toListId);

      oldList.cards.splice(oldList.cards.indexOf(cardId), 1);
      newList.cards.splice(position, 0, cardId);

      await oldList.save();
      await newList.save();

      return res.status(200).send({ oldList, newList });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/nameChange", jsonParser, async (req, res) => {
  try {
    const { nameBoard, boardId } = req.body;

    const board = await dataBoards.findById(boardId);

    if (!board) return res.status(400).send("Error");

    board.nameBoard = nameBoard;

    await board.save();

    return res.status(200).send({ nameBoard, boardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/changeName", jsonParser, async (req, res) => {
  try {
    const { listId, nameList } = req.body;

    const list = await dataList.findById(listId);

    if (!list) return res.status(400).send("Error");

    list.nameList = nameList;

    await list.save();

    return res.status(200).send({ listId, nameList });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/changeName", jsonParser, async (req, res) => {
  try {
    const { cardId, nameCard } = req.body;

    const card = await dataCard.findById(cardId);

    if (!card) return res.status(400).send("Error");

    card.nameCard = nameCard;

    await card.save();

    return res.status(200).send({ cardId, nameCard });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/changeDescription", jsonParser, async (req, res) => {
  try {
    const { cardId, description } = req.body;

    const card = await dataCard.findById(cardId);

    if (!card) return res.status(400).send("Error");

    card.descriptionCard = description.trim();

    await card.save();

    return res.status(200).send({ cardId, description });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/deleteCard", jsonParser, async (req, res) => {
  try {
    const { cardId } = req.body;

    const card = await dataCard.findById(cardId);

    const [list] = await dataList.find({ cards: cardId });

    if (!card || !list) return res.status(400).send("Error");

    await card.remove();
    await list.cards.remove({ _id: cardId });
    await list.save();

    return res.status(200).send({ cardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/archive", jsonParser, async (req, res) => {
  try {
    const { cardId } = req.body;

    const card = await dataCard.findById(cardId);

    if (!card) return res.status(400).send("Error");

    card.archived = true;

    await card.save();

    return res.status(200).send({ cardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/card/unarchive", jsonParser, async (req, res) => {
  try {
    const { cardId } = req.body;

    const card = await dataCard.findById(cardId);

    if (!card) return res.status(400).send("Error");

    card.archived = false;

    await card.save();

    return res.status(200).send({ cardId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/delete", jsonParser, async (req, res) => {
  try {
    const { listId } = req.body;

    const list = await dataList.findById(listId);

    const [board] = await dataBoards.find({ lists: listId });

    if (!list || !board) return res.status(400).send("Error");

    list.cards.map((card) => {
      dataCard.find({ _id: card }, (err, doc) => {
        if (err) console.log(err);

        if (doc) {
          doc[0].remove();
        }
      });
    });

    await list.remove();
    await board.lists.remove({ _id: listId });
    await board.save();

    return res.status(200).send({ listId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/archive", jsonParser, async (req, res) => {
  try {
    const { listId } = req.body;

    const list = await dataList.findById(listId);

    if (!list) return res.status(400).send("Error");

    list.archived = true;

    await list.save();

    return res.status(200).send({ listId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/board/list/unarchive", jsonParser, async (req, res) => {
  try {
    const { listId } = req.body;

    const list = await dataList.findById(listId);

    if (!list) return res.status(400).send("Error");

    list.archived = false;

    await list.save();

    return res.status(200).send({ listId });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.post("/user/change/name", jsonParser, async (req, res) => {
  try {
    const { userName, oldName } = req.body;

    const user = await dataUsers.findOne({ name: oldName });

    if (!user) return res.status(400).send("Error");

    user.name = userName;

    await user.save();

    return res.status(200).send({ userName });
  } catch (error) {
    console.log(error);
    return res.status(400).send("Error");
  }
});

app.ws("/", (ws, req) => {
  ws.on("message", (msg) => {
    const {method} = JSON.parse(msg);
    console.log(method);
    
    switch (method) {
      case "connection":
        console.log("asd");
        ws.send("you are connected");
        break;

      default:
        break;
    }
  });
});

app.ws("/form/oldUser", jsonParser, async (ws, req) => {
  ws.on("message", (msg) => {
    console.log(msg);
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
