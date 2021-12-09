const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataCardsSchema = new Schema(
  {
    cardText: String,
    idUser: String,
    idBoard: String,
    idColumn: String,
  },
  { versionKey: false }
);

module.exports = mongoose.model("dataCard", dataCardsSchema);
