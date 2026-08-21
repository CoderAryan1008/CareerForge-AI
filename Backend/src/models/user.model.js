const mongoose = require("mongoose");
//Humme yaahan pe user ka schema define karna hain ki kis format main user ki info store hoga in the db
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: [true, "A user with this username already exists !!!"],//Isse hum ek error message generate kar rahe hain ki iss name ka user already exists kar raha ahin
    required: true
  },

  email: {
    type: String,
    unique: [true, "User with given email already exists !!!"],
    required: true
  },

  password: {
    type: String,
    required: true
  }
})
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
