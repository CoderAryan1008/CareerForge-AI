//Isme humme authenticate karna hain using middleware ki user ka token sahi toh hain na
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
//Iss middleware ka kaam hain toh check ki user login toh hain na
async function AuthUser(req, res, next) { //Yeh ek middleware hain isliye iske 3 args hain
  const authorization = req.headers.authorization;
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;
  const token = req.cookies.token || bearerToken;
  if (!token) {
    return res.status(401).json({
      message: "Token Not found !!!"

    })
  } // Abb humne yaahan verify kiya hain ki kya token toh exist karta hain na in the cookie

  const isTokenblacklisted = await blacklistModel.findOne({ token });
  if (isTokenblacklisted) {
    //Yaani yeh blacklist ho gaaya hain token
    return res.status(404).json({
      message: "Token is invalid..."
    })
  }
  //Abb humme check karna hain yaahan ki kya token main ched chad toh nahi hain
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);//Abb humme yaahan payload nikalna hain
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