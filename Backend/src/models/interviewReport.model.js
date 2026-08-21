//Humme yaahan model create karna hain for interview report
const mongoose = require("mongoose");
//Abb iska use karke schema and model bana hain
/**
 * ->Resume
 * ->Self description
 * ->Technical Qns :
 *   ->{
 *       Qn , Intent , Anwer
 *     }
 * 
 *   ->Behavioural Qns :
 *   ->{
 *       Qn , Intent , Anwer
 *     }
 * 
 */

const Technical_QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is Required"]

  },
  intent: {
    type: String,
    required: [true, "Intent for the question is Required"]

  },
  answer: {
    type: String,
    required: [true, "Answer for the Question is Required"]

  }
}, {
  _id: false //Yaani humme id nahi chaihiye 
})

const Behavioral_QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is Required"]

  },
  intent: {
    type: String,
    required: [true, "Intent for the question is Required"]

  },
  answer: {
    type: String,
    required: [true, "Answer for the Question is Required"]

  }
}, {
  _id: false //Yaani humme id nahi chaihiye 
})

const skill_gapSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: [true, "Skill is required"]
  },
  severity: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: [true, "Severity is required"]
  }

}, {
  _id: false
})

const preparationplanSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: [true, "Day is required"]
  },
  focus: {
    type: String,
    required: [true, "Focus Area id required"],

  },
  tasks: [{
    type: String,
    required: [true, "Tasks is required"],

  }]
})

const ReportSchema = new mongoose.Schema({
  jobDescription: {
    type: String,
    required: [true, "Job description is required for analysis"]
  },
  resume: {
    type: String
  },
  selfDescription: {
    type: String
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  technicalQuestions: [Technical_QuestionSchema],
  behavioralQuestions: [Behavioral_QuestionSchema],
  skillGaps: [skill_gapSchema],
  preparationPlan: [preparationplanSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

const ReportModel = mongoose.model("Report", ReportSchema);
//Abb yeh humara deal karega with the db and backend
module.exports = ReportModel;