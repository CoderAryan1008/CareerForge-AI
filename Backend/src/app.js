//Isma humara pura backend rahega
const cors = require("cors");

const express = require('express');
const cookieParser = require("cookie-parser");//Isse hum cookie ko padh lenge
//Humme yaahan pe cors ko bhi use karna hain jisse connection main error na aaye 
const app = express();
app.use(express.json()); //For converting the html request into json form
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true //Yaani cookie handle kar saake
}));
const AuthRouter = require("./routes/auth.routes");
//For accessing the auth related routes
const InterviewRouter = require("./routes/interview.ai.js")
app.use("/api/interview/", InterviewRouter);
app.use("/api/auth/", AuthRouter);
//yeh define kar raha hain ki auth related saare api's ko humme ./api/auth/ prefix se start karna hain

module.exports = app; 