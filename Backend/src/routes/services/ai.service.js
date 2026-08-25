//Humme yaahan ai ki api ke y set karni hain
const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");//Isse humme structured output milega from ai ke answer se
const chromium = require("@sparticuz/chromium");
const puppeteerCore = require("puppeteer-core");
const ai = new GoogleGenAI({
  apiKey: process.env.GoogleGenAI_APIKEY
});

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
      responseJsonSchema: z.toJSONSchema(interviewReportSchema)//Isme hum baata rahe hain ki kiss structure main humme chahiye answer 
    }
  });

  return JSON.parse(response.text); //Yaani jo bhi baana hain usse js ke object main convert kar do
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

    res.set({//Isse hum user ke liye seedha download karke de rahe hain pdf ko
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
    resumeHtml: z.string().describe("The html form of the resume in proper formal designed format which can be converted into pdf using puppeteer")
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
Generate a polished, ATS-friendly, print-ready A4 resume as a single HTML document, using the candidate data and job description below.

RULES:
- Use only the provided candidate info — do not invent/embellish skills, experience, education, projects, certifications, or achievements.
- Tailor wording, emphasis, and order to match the job description without fabricating content.
- Highlight skills/experience/achievements that align with both the self-description and job description.

LINKS:
- Copy every hyperlink from the original resume exactly (char-for-char) — no shortening, guessing, or altering.
- Convert all links to real clickable elements: <a href="EXACT_URL">Text</a>.
- If a URL lacks "https://", prepend it without changing the rest of the URL.
- Include all profile links (GitHub, LinkedIn, portfolio, blog, Dev.to, LeetCode, CodeChef, etc.) in contact/project sections.
- Verify every href matches the original source before finalizing.

PHOTO:
- If a photo exists in the original, embed it (base64 <img>) neatly in the header, circular or rounded-square, fixed size (e.g. 100–120px), without breaking layout.
- If no photo exists, don't add one.

LAYOUT & STYLING (critical — must look professionally designed, not like plain text with lines):
- Use a modern sans-serif font stack (e.g. 'Calibri', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif).
- Establish clear visual hierarchy: name (largest, bold, ~24-28px), section headings (uppercase or bold, ~13-15px, with a subtle bottom border or accent color), body text (~10.5-11px for print density).
- Use ONE consistent accent color (e.g. a professional navy, teal, or dark blue) applied sparingly to headings, borders, links, or icons — not the whole page.
- Consistent spacing: define fixed margins between sections (e.g. 14-18px), and consistent line-height (1.4-1.5) for readability.
- Use flexbox/grid for alignment — e.g. two-column layout for header (name/title left, contact/photo right), or job entries with role/title on left and dates aligned right.
- Add subtle dividers (thin border-bottom, 1px, light gray) between sections instead of large blank gaps.
- Bullet points for experience/projects should be tight (no excessive padding), left-aligned, with a small consistent indent.
- Contact info and links row should be a single clean horizontal line (or wrap gracefully), separated by small icons or a subtle separator (•, |), not stacked awkwardly.
- Avoid default browser styling — explicitly reset margins/padding on body, ul, li, h1-h6, p.
- A4 size (210mm x 297mm), consistent 15-20mm margins on all sides via a padded page container — no edge-to-edge content.
- Ensure layout doesn't break/overflow when printed or exported to PDF; avoid page-break issues (avoid splitting a bullet or heading across pages).
- ATS-friendly: semantic HTML, no tables for core content, no text embedded in images.

OUTPUT:
- Return ONLY raw HTML (with inline <style> in <head>) — no markdown fences, no explanations.

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