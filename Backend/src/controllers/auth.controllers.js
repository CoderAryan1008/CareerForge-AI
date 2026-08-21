//Abb humme yaaha controllers ka use karna hain jisse hum main kaam yaahan pe karle through fns and fir inhe export karake aage use karle
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model")

//Abb hum iske through db se access kar paayenge

/**
 *
 * @name : userregisterController
 * @description : Using this controller for verifying the inputs received from the user while registering
 */

async function userregisterController(req, res) {
  const { username, email, password } = req.body;
  //yaani body se extract karo info of user joh usne enter ki hain

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide email_id or username or password !!!"
    });
  }

  const ifUserExists = await userModel.findOne({
    $or: [{ username }, { email }]
  });

  //yaani yeh return karega ki kya user with given username or email exists or not
  if (ifUserExists) {
    return res.status(400).json({
      message: "User with given username or email already exists !!!"
    });
  }

  //Abb humme yaahan user ke password ko hash karna hain along with using the jwt and cookie-parser for auto authentication
  const hashpassword = await bcrypt.hash(password, 10);

  //Abb humme store karna hain iss user ko
  const User = await userModel.create({
    username,
    email,
    password: hashpassword
  });

  const token = jwt.sign(
    { id: User._id, username: User.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d"
    }
  );

  //Abb humme iss token ko cookie main set karna hain
  res.cookie("token", token);

  //Yaani hum cookies se token naam ke variable in the object se user ko authenticate karenge
  return res.status(201).json({
    message: "User successfully Signed-Up...",
    user: {
      id: User._id,
      username: User.username,
      email: User.email
    }
  });
}

async function loginUserController(req, res) {
  //Abb humme yaahan user ke login kiye hua ko authenticate karna hain

  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    //Yaani user with given email exist nahi karta
    return res.status(400).json({
      message: "Invalid User credentials ..."
    });
  }

  //Abb humme pw check karna hain using the bcrypt
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    //Yaani password galat hain
    return res.status(400).json({
      message: "Invalid User credentials ..."
    });
  }

  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "1d"
    }
  );

  //Abb humme iss token ko cookie main set karna hain
  res.cookie("token", token);

  //Yaani hum cookies se token naam ke variable in the object se user ko authenticate karenge
  return res.status(200).json({
    message: "User successfully Logged-In...",
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}

async function logoutUserController(req, res) {
  //Humme yaahan user ke token ko blacklist main daalna hain
  const token = req.cookies.token;
  if (token) {
    await blacklistModel.create({ token });
    //Yaani isse blacklist main daal do

  }
  res.clearCookie("token");
  return res.status(200).json({
    message: "User logged-out successfully !!!"
  });
}

async function getmeController(req, res) {
  //Humme yaahan user ki info ko user ko deena hain
  const user = await userModel.findById(req.user.id);
  return res.status(200).json({
    message: "User found successfully...",
    user:
    {
      id: user.id,
      username: user.username,
      email: user.email
    }
  })
}

module.exports = {
  userregisterController,
  loginUserController,
  logoutUserController,
  getmeController
};