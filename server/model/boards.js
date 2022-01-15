const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataBoardsSchema = new Schema(
  {
    nameBoard: String,
    lists: [
      {
        type: Schema.Types.ObjectId,
        ref: "datalists",
      },
    ],
    idUser: { type: Schema.Types.ObjectId, ref: "datausers" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("dataBoard", dataBoardsSchema);
