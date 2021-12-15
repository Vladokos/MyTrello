const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataListsSchema = new Schema(
  {
    nameList: String,
    idUser: String,
    idBoard: String
  },
  { versionKey: false }
);


module.exports = mongoose.model("dataList", dataListsSchema);