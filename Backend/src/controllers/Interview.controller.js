const pdfParse = require("pdf-parse");
const ReportModel = require("../models/interviewReport.model.js");
const { getStructuredResponseFromAI, generateResumefromAI } = require("../routes/services/ai.service.js");

function extractUrlsFromText(text = "") {
  const urlRegex = /(https?:\/\/[^\s<>"')]+|www\.[^\s<>"')]+|mailto:[^\s<>"')]+)/gi;
  const matches = [...new Set((text.match(urlRegex) ?? []).map((url) => url.trim()))];

  return matches.map((url) => (/^www\./i.test(url) ? `https://${url}` : url));
}

//Abb humme isse generate karwana hain report ko
//Abb humme yaaha saare controllers banane hain for the interview-buddy ke liye
async function generateInterviewReportcontroller(req, res) {

  let resumeContent = "";
  if (req.file) {
    //Yaani aagar mujhe pdf mila hain
    resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
  }
  const resumeText = resumeContent && resumeContent.text ? resumeContent.text : "";
  const resumeUrls = extractUrlsFromText(resumeText);
  const enrichedResumeText = resumeUrls.length ? `${resumeText}\nRelevant URLs:\n${resumeUrls.map((url) => `- ${url}`).join("\n")}` : resumeText;
  const selfDescription = req.body.selfDescription ?? req.body.selfdescription;
  const jobDescription = req.body.jobDescription ?? req.body.jobdescription;

  const reportbyAi = await getStructuredResponseFromAI({
    resume: enrichedResumeText,
    selfDescription,
    jobDescription
  });

  const interviewReport = await ReportModel.create({
    userId: req.user.id,
    resume: enrichedResumeText,
    selfDescription,
    jobDescription,
    ...reportbyAi
  });
  return res.status(201).json({
    message: "Report created successfully ...",
    interviewReport
  })
  //Abb humme isse store karna hain in the schema of report

}

async function getInterviewReportByIDController(req, res) {
  const { reportId } = req.params;
  const report = await ReportModel.findOne({ _id: reportId, userId: req.user.id });

  if (!report) {
    return res.status(404).json({
      message: "The report with following id doesn't exists for Ur account ..."
    })
  }

  const reportData = report.toObject();
  reportData.jobDescription = reportData.jobDescription ?? reportData.jobdescription;
  reportData.selfDescription = reportData.selfDescription ?? reportData.selfdescription;
  reportData.userId = reportData.userId ?? reportData.users;

  return res.status(200).json({
    message: "Report is successfully fetched ...",
    report: reportData
  })
}

async function getAllReportsController(req, res) {
  //Abb humme given user id ke liye saare uske generated reports usse show karna hain
  const Reports = await ReportModel.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);
  //Abb humme yeh saare reports share karne hain bass unke id and unki date and score
  return res.status(200).json({
    message: "All reports fetched successfully",
    Reports
  })
}

async function generateResumeController(req, res) {
  //Abb humme yaahan ai ki help se resume generate karna hain
  const { interviewReportID } = req.params;
  //Yaani humme parameterized url se isse nikalna hain
  const InterviewReport = await ReportModel.findById(interviewReportID);
  if (!InterviewReport) {
    return res.status(404).json({
      message: `No Report Exists with this ${interviewReportID} !!!`

    })
  }

  const { resume, selfDescription, jobDescription } = InterviewReport;
  const pdfBuffer = await generateResumefromAI({ resume: resume ?? "", selfDescription: selfDescription ?? "", jobDescription: jobDescription ?? "" });
  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="resume_${interviewReportID}.pdf"`,
    'Content-Length': pdfBuffer.length
  });

  res.send(pdfBuffer);
}
module.exports = { generateInterviewReportcontroller, getInterviewReportByIDController, getAllReportsController, generateResumeController };