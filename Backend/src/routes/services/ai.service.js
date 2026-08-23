//Humme yaahan ai ki api ke y set karni hain
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");//Isse humme structured output milega from ai ke answer se
const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core");
const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI_APIKEY
});
async function invokeGeminiAI() {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: "hello gemini ! Can u help me for what is meant by interview ?"
  })
  console.log(response.text);

};

const interviewReportSchema = z.object({
  matchScore: z
    .number()
    .describe(
      "Match the score between the candidate's resume or self-description and the job description, which indicates how well the candidate fits the job and be honest in your answer"
    ),
  technicalQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe("The question that can be asked in the interview"),

        intent: z
          .string()
          .describe(
            "The intent of the interviewer for asking this question"
          ),

        answer: z
          .string()
          .describe(
            "How to answer such question, what points should be covered in the answer, and what approach should be taken"
          ),
      })
    )
    .describe(
      "The technical questions that can be asked in the interview for examining the technical skills of the candidate"
    ),

  behavioralQuestions: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "The question that can be asked in the interview for examining the behaviour of the candidate"
          ),

        intent: z
          .string()
          .describe(
            "The intent of the interviewer for asking this question"
          ),

        answer: z
          .string()
          .describe(
            "How to answer such question, what points should be covered in the answer, and what approach should be taken"
          ),
      })
    )
    .describe(
      "The behavioral questions that can be asked in the interview for examining the behaviour of the candidate"
    ),

  skillGaps: z
    .array(
      z.object({
        skill: z
          .string()
          .describe(
            "The skill that the candidate is lacking and needs to improve to crack the interview"
          ),

        severity: z
          .enum(["Low", "Medium", "High"])
          .describe(
            "The severity of the skill gap and how important this skill is for cracking the interview"
          ),
      })
    )
    .describe(
      "The skills that the candidate is lacking and needs to improve for better performance in the interview"
    ),

  preparationPlan: z
    .array(
      z.object({
        day: z
          .number()
          .describe("The day number for which the preparation plan is given"),

        focus: z
          .string()
          .describe(
            "The area of focus for the preparation on that day"
          ),

        tasks: z
          .array(z.string())
          .describe(
            "The tasks that the candidate needs to perform on that day for learning and improving the skills in detailed form, maintained in proper sequential manner for better understanding and learning"
          ),
      })
    )
    .describe(
      "A 7-day preparation plan for the candidate according to the job describe and the candidate's resume"
    ),
});


function extractUrlsFromText(text = "") {
  const urlRegex = /(https?:\/\/[^\s<>")']+|www\.[^\s<>"')]+|mailto:[^\s<>"')]+)/gi;
  const matches = [...new Set((text.match(urlRegex) ?? []).map((url) => url.trim()))];

  return matches.map((url) => {
    if (/^www\./i.test(url)) return `https://${url}`;
    return url;
  });
}

async function getStructuredResponseFromAI({ resume, selfDescription, jobDescription }) {
  const prompt = `Properly Generate an interview report for the provided candidate with following info :
  Resume:${resume},
  Self_Description:${selfDescription},
  Job_Description:${jobDescription}
  in the provided format
  `

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(interviewReportSchema)
    }
  });

  return JSON.parse(response.text);
}

function normalizeResumeHtml(htmlContent) {
  const rawHtml = String(htmlContent || "").trim();

  if (!rawHtml) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8" /><style>@page{margin:0.5in;} html,body{margin:0;padding:0;background:#fff;} body{font-family:Arial,sans-serif;color:#111;} .resume-page{box-sizing:border-box;padding:0.35in 0.45in;background:#fff;}</style></head><body><div class="resume-page"></div></body></html>`;
  }

  const pageStyles = `
    <meta charset="UTF-8" />
    <style>
      @page { margin: 0.5in; }
      html, body {
        margin: 0;
        padding: 0;
        background: #fff;
        color: #111;
        font-family: Arial, sans-serif;
      }
      body {
        box-sizing: border-box;
      }
      .resume-page {
        box-sizing: border-box;
        background: #fff;
        padding: 0.35in 0.45in;
      }
      * {
        box-sizing: border-box;
      }
      a {
        color: inherit;
        text-decoration: underline;
      }
    </style>
  `;

  if (!/<html[\s>]/i.test(rawHtml)) {
    return `<!DOCTYPE html><html><head>${pageStyles}</head><body><div class="resume-page">${rawHtml}</div></body></html>`;
  }

  if (/<body[\s>]/i.test(rawHtml) && !/<style/i.test(rawHtml)) {
    return rawHtml.replace(/<head[^>]*>/i, (match) => `${match}${pageStyles}`);
  }

  if (/<body[\s>]/i.test(rawHtml) && !/class=["']resume-page["']/i.test(rawHtml)) {
    return rawHtml.replace(/<body[^>]*>/i, (match) => `${match}<div class="resume-page">`).replace(/<\/body>/i, "</div></body>");
  }

  return rawHtml;
}

// ---------------------------------------------------------------------------
// PUPPETEER BROWSER REUSE (kept private to this file — nothing else needs it)
// ---------------------------------------------------------------------------

// Lives outside any function, so it stays alive in memory across requests
// as long as the server process itself keeps running.
let browserInstance = null;

async function getBrowser() {
  // Reuse the existing browser if it's still alive
  if (browserInstance && browserInstance.connected) {
    return browserInstance;
  }

  console.log("Launching a new Chromium instance...");
  browserInstance = await puppeteerCore.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  // Safety net: if the browser crashes/closes unexpectedly,
  // reset so the NEXT request rebuilds it fresh instead of reusing a dead one.
  browserInstance.on("disconnected", () => {
    console.log("Chromium instance disconnected, will relaunch on next request.");
    browserInstance = null;
  });

  return browserInstance;
}

async function generatePdffromHTML(html) {
  const browser = await getBrowser(); // reuse existing browser, or build once
  const page = await browser.newPage(); // opening a new tab is cheap and fast

  try {
    const normalizedHtml = normalizeResumeHtml(html);
    await page.setContent(normalizedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    return pdfBuffer;
  } finally {
    await page.close(); // always close the tab, NOT the browser
  }
}

async function generateResumeController(req, res) {
  try {
    const { interviewReportID } = req.params;
    const InterviewReport = await ReportModel.findById(interviewReportID);
    if (!InterviewReport) {
      return res.status(404).json({ message: `No Report Exists with this ${interviewReportID} !!!` });
    }

    const { resume, selfDescription, jobDescription } = InterviewReport;
    const pdfBuffer = await generateResumefromAI({
      resume: resume ?? "",
      selfDescription: selfDescription ?? "",
      jobDescription: jobDescription ?? "",
    });

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="resume_${interviewReportID}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("generateResumeController failed:", err); // <-- this will now actually show up
    res.status(500).json({ message: "Failed to generate resume", error: err.message });
  }
}
async function generateResumefromAI({ resume, selfDescription, jobDescription }) {
  //Abb humme yaahan ai ko provide karna hain teeno info and for woh humme ek proper html form main resume generate karke deega jisse ab hum puppeteer ke through pdf main convert karenge
  const resumePdfSchema = z.object({
    resumeHtml: z.string().describe("The html form of the resume which can be converted into pdf using puppeteer")
  });

  const extractedUrls = extractUrlsFromText(`${resume ?? ""}\n${selfDescription ?? ""}\n${jobDescription ?? ""}`);
  const linksSection = extractedUrls.length
    ? `\nRelevant URLs extracted from the source resume or profile:\n${extractedUrls.map((url) => `- ${url}`).join("\n")}\n`
    : "";

  const prompt = `
Create a professionally tailored and ATS-friendly resume for the candidate using the following information:

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

${linksSection}
Generate the resume in valid HTML that can be directly rendered and converted into a PDF using Puppeteer.

Requirements:
You are an expert resume writer and HTML/CSS formatter. Using the candidate's original resume content and the target job description provided below, generate a polished, ATS-friendly, print-ready resume as a single HTML document.

STRICT CONTENT RULES:
- Do not invent or embellish any skills, experience, education, projects, certifications, or achievements. Use only what is provided in the candidate's original resume/data.
- Tailor emphasis, wording, and ordering to align with the job description — but do not fabricate anything to match it.
- Cover all relevant points from both the self-description and job description, highlighting skills, experience, and achievements that align with the role.

LINKS (must be preserved exactly):
- Copy every hyperlink from the original resume character-for-character — do not shorten, rewrite, guess, or "clean up" any URL.
- Convert every link into a real clickable HTML element: <a href="EXACT_ORIGINAL_URL">Display Text</a>.
- If a URL is missing "https://", normalize it to a full valid URL (e.g., "linkedin.com/in/xyz" → "https://linkedin.com/in/xyz") — but do not alter the path, username, or query parameters.
- Include all profile/portfolio links (GitHub, LinkedIn, personal website, blog, Dev.to, LeetCode, CodeChef, Codeforces, HackerRank, etc.) in the contact section, and any project-specific links in the relevant project entries.
- Double-check at the end that every href in your output matches the original source link exactly (aside from the https:// normalization).

PHOTO:
- If the original resume includes a photo, embed it in the HTML (as a base64 <img> or referenced image) in a way that fits naturally into the header/contact area without breaking the layout, resizing, or distorting it.
- If no photo is present, do not add a placeholder image or invent one.

LAYOUT & STYLING:
- Design for a proper A4 page size with consistent, visible margins/padding on all sides (no edge-to-edge content).
- Wrap all content in a page container div with defined padding/margin so printed/exported PDF output looks clean.
- Use a clean, professional, modern, single-column or well-balanced multi-column layout appropriate for a resume.
- Ensure the layout stays intact when converted to PDF (avoid elements that overflow, get cut off, or collapse when printed).
- Keep formatting ATS-friendly: use semantic HTML (headings, lists), avoid tables for core content, avoid text embedded only in images.

OUTPUT FORMAT:
- Return ONLY the raw HTML (including inline <style> in the <head>) — no Markdown code fences, no explanations, no extra commentary before or after.

---
CANDIDATE RESUME DATA:
[PASTE ORIGINAL RESUME TEXT / DATA HERE]

JOB DESCRIPTION:
[PASTE JOB DESCRIPTION HERE]
`;


  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(resumePdfSchema)
    }
  });
  const jsonResume = JSON.parse(response.text);
  const pdfBuffer = await generatePdffromHTML(jsonResume.resumeHtml);
  return pdfBuffer;
}


module.exports = { getStructuredResponseFromAI, generateResumefromAI };