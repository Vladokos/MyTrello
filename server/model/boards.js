const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataBoardsSchema = new Schema(
  {
    nameBoard: String,
    idUser: { type: Schema.Types.ObjectId, ref: 'DataUser' },
  },
  { versionKey: false }
);


module.exports = mongoose.model("dataBoard", dataBoardsSchema);