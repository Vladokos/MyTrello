const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataCardsSchema = new Schema(
  {
    nameCard: String,
    idBoard: { type: Schema.Types.ObjectId, ref: 'databoards' },
    idList: { type: Schema.Types.ObjectId, ref: 'datalists' },
  },
  { versionKey: false }
);

module.exports = mongoose.model("dataCard", dataCardsSchema);
