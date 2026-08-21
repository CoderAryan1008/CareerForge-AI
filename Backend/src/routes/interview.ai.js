//Abb humme yaahan routes banane hain for the ai feature of the project
const { Router } = require("express");
const InterviewRouter = Router();
const AuthUser = require("../middlewares/auth.middleware.js")
const upload = require("../middlewares/file.middlware.js");
const { generateInterviewReportcontroller, getInterviewReportByIDController, getAllReportsController, generateResumeController } = require("../controllers/Interview.controller.js");
InterviewRouter.post("/", AuthUser, upload.single("resume"), generateInterviewReportcontroller);
//Abb humme ek endpoint banana hain jaahan user jo bhi report id de uska data usse mil jaaye
InterviewRouter.get("/report/:reportId", AuthUser, getInterviewReportByIDController);
InterviewRouter.get("/report", AuthUser, getAllReportsController);
InterviewRouter.get("/generateresume/:interviewReportID", AuthUser, generateResumeController)
module.exports = InterviewRouter;