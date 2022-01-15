const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataCardsSchema = new Schema(
  {
    nameCard: String,
    idBoard: { type: Schema.Types.ObjectId, ref: "databoards" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("dataCard", dataCardsSchema);
