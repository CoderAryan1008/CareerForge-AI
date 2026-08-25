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
You are an elite resume designer and ATS (Applicant Tracking System) optimization expert who builds resumes for candidates landing offers at top companies.

Create a professionally tailored, visually beautiful, and ATS-friendly resume for the candidate using the following information:

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

CONTENT RULES:
- Use only the provided candidate info — do not invent/embellish skills, experience, education, projects, certifications, or achievements.
- Tailor wording, emphasis, and order to match the job description without fabricating content.
- Highlight skills/experience/achievements that align with both the self-description and job description.
- Lead bullet points with strong action verbs and quantify impact wherever the source data allows (numbers, %, scale) — never invent metrics that aren't in the source data.
- Keep bullets concise (ideally 1-2 lines each) so the resume stays scannable and ideally fits on one page (max two pages only if content genuinely requires it).

LINKS — THIS IS CRITICAL, DO NOT SKIP OR DROP ANY LINK:
- Every single hyperlink present in the original resume, self-description, or the extracted URLs list above MUST appear in the final HTML — copy each URL exactly (char-for-char), no shortening, truncating, guessing, or altering.
- Convert every link into a real clickable element: <a href="EXACT_URL" target="_blank" rel="noopener noreferrer">Display Text</a>.
- If a URL lacks "https://" or "http://", prepend "https://" without changing the rest of the URL.
- Place profile/social links (GitHub, LinkedIn, portfolio, personal website, blog, Dev.to, LeetCode, CodeChef, Behance, etc.) in the header/contact row, and project-specific links (live demo, repo, case study) next to the relevant project entry.
- Before finalizing, cross-check every href against the original source text and the extracted URLs list — none should be missing, mistyped, or paraphrased.
- Never render a link as plain unlinked text — always wrap it in an <a> tag.

VISUAL DESIGN — THE RESUME MUST LOOK PREMIUM AND DESIGNER-MADE, NOT LIKE A DEFAULT TEMPLATE:
- Use a modern, refined sans-serif font stack (e.g. 'Calibri', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif).
- Establish a clear, confident visual hierarchy:
  - Candidate name: largest element, bold, ~26-30px, set in the accent color or near-black.
  - Optional role/title tagline directly under the name: ~13-14px, medium weight, muted gray.
  - Section headings: ~13-15px, bold, uppercase with slight letter-spacing (~0.5-1px), accompanied by a thin accent-colored underline or left border.
  - Body/bullet text: ~10.5-11px for print density, line-height 1.4-1.5 for readability.
- Pick ONE sophisticated, professional accent color (deep navy, slate blue, forest green, or charcoal teal) and use it sparingly and consistently — headings, thin dividers, link color, small icon accents, maybe a subtle header background band. Never use more than one accent color, and never make the page loud or colorful.
- Layout:
  - Two-column header: candidate name/title/summary on the left, contact info (and photo, if present) aligned right — or a clean centered header if that suits the content better.
  - For experience/education entries: role/title and company on the left, dates aligned to the right on the same line, using flexbox with justify-content: space-between.
  - Optional: a slim two-column body layout (e.g. ~65/35 split) with core sections (experience, projects, education) on the left and a sidebar (skills, links, certifications) on the right — only if the content is rich enough to support it; otherwise use a clean single-column layout. Choose whichever layout best fits the amount of content without leaving large empty gaps or causing overflow.
- Section spacing: consistent margin of 14-18px between sections, consistent 6-8px between entries within a section.
- Use subtle 1px light-gray divider lines between major sections instead of large blank gaps.
- Bullet points: tight consistent left indent, no excessive padding, custom bullet marker style (e.g. small dash or dot) rather than default browser bullets.
- Contact/links row: a single clean horizontal line (wrapping gracefully if needed), items separated by a small subtle separator such as "•" or "|", never stacked awkwardly on separate lines unless space truly requires it.
- Explicitly reset default browser styling on body, ul, ol, li, h1-h6, p, a (margin: 0; padding: 0; where appropriate) before applying custom styles.
- Use whitespace intentionally — generous but not wasteful — so the page feels balanced and premium rather than cramped or sparse.

PRINT / PDF SAFETY:
- A4 size (210mm x 297mm) with consistent 15-20mm page padding on all sides via a padded page container — no edge-to-edge content.
- Ensure the layout never overflows or breaks when printed/exported to PDF; avoid splitting a bullet, heading, or entry awkwardly across a page break (use CSS like break-inside: avoid on entries where useful).
- Everything must render correctly with inline <style> only — no external stylesheets or fonts that require network access.

ATS-FRIENDLINESS (do not sacrifice this for visual flair):
- Use clean semantic HTML (headings, paragraphs, lists) — no tables for core content structure.
- No text embedded inside images; if a photo is included it must only be a photo, never a text-bearing image.
- Keep the reading order logical top-to-bottom, left-to-right so ATS parsers extract content correctly even if visual columns are used.
- Standard section names (e.g. "Experience", "Education", "Skills", "Projects") so ATS keyword matching works reliably.

PHOTO:
- If a photo exists in the original, embed it (base64 <img>) neatly in the header, circular or rounded-square, fixed size (e.g. 100-120px), without breaking layout.
- If no photo exists, don't add one.

OUTPUT:
- Return ONLY raw HTML (with inline <style> in <head>) — no markdown fences, no explanations, no commentary.
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