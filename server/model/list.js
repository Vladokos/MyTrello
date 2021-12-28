const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataListsSchema = new Schema(
  {
    nameList: String,
    idUser: { type: Schema.Types.ObjectId, ref: 'datausers' },
    idBoard:{ type: Schema.Types.ObjectId, ref: 'databoards' },
  },
  { versionKey: false }
);


module.exports = mongoose.model("dataList", dataListsSchema);