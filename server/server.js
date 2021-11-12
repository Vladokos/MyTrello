const express = require("express");
const mongoose = require("mongoose");

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

  const data = new dataUsers({ email: email, name: name, password: password });

  data.save((err) => {
    if (err) {
      res.sendStatus(500);
      throw err;
    }
    res.sendStatus(200);
  });
});

app.listen(5000, () => {
  console.log("Server is running");
});
