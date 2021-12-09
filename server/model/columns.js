const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataColumnsSchema = new Schema(
  {
    columnName: String,
    idUser: String,
    idBoard: String
  },
  { versionKey: false }
);


module.exports = mongoose.model("dataColumn", dataColumnsSchema);