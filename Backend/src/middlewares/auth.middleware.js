//Isme humme authenticate karna hain using middleware ki user ka token sahi toh hain na
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
//Iss middleware ka kaam hain toh check ki user login toh hain na
async function AuthUser(req, res, next) { //Yeh ek middleware hain isliye iske 3 args hain
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Token Not found !!!"

    })
  }

  const isTokenblacklisted = await blacklistModel.findOne({ token });
  if (isTokenblacklisted) {
    //Yaani yeh blacklist ho gaaya hain token
    return res.status(404).json({
      message: "Token is invalid..."
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  }
  catch (err) {
    return res.status(401).json({
      message: "Invalid Token... "

    })

  }
}
module.exports = (AuthUser);