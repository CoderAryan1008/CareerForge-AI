//Ismi humme humare db se connect hona hain
const mongoose = require("mongoose");

async function connecttodb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected to the server !!!");

  }
  catch (err) {
    console.log(err);
  }
}
module.exports = connecttodb;