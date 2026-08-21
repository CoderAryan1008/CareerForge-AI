//Isme humme saare blacklisted tokens ko daalna hain yaahan
const mongoose = require("mongoose");
const blacklistSchema = new mongoose.Schema({
  tokenId: {
    type: String,
    require: [true, "Token Id is needed for blacklisting it in the server side code"]

  }
});

const blacklistModel = mongoose.model("BlackList", blacklistSchema);
module.exports = blacklistModel;