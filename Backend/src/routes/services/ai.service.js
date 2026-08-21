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

async function generatePdffromHTML(htmlContent) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  await page.setContent(normalizeResumeHtml(htmlContent), {
    waitUntil: "networkidle2",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "0.5in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in",
    },
  });

  await browser.close();

  return pdfBuffer;
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
- Add the exact links in the resume as clickable hyperlinks using proper HTML <a href="...">...</a> elements.
- Tailor the resume specifically to the provided job description while staying strictly truthful to the candidate's information.
- Do not invent skills, experience, education, projects, certifications, or achievements that are not provided.
- Preserve all relevant hyperlinks from the original resume.
- Convert hyperlinks into proper HTML <a href="...">...</a> elements so they remain clickable in the generated PDF.
- Preserve the original URLs accurately and use complete URLs including https:// where applicable.
- If the resume contains GitHub, LinkedIn, portfolio, blog, Dev.to, leetcode, codechef, or other profile links, include them in the contact section or project section as clickable links in the HTML.
- If a URL appears without https://, normalize it to a valid full URL before using it in href attributes.
- Maintain a clean, professional, well-structured resume layout suitable for a PDF.
- Use a proper A4 resume layout with consistent visible margins on all sides. Add CSS for the page and content container so the printed resume does not stretch edge-to-edge.
- Include a wrapper such as a page container with padding and margin so the resume has clean spacing around the content.
- Return only the HTML content. Do not include Markdown code fences, explanations, or any text outside the HTML.
- The resume should be ATS friendly.
- Also cover all the points mentioned in the self-description and job description in the resume and highlight the relevant skills, experience, and achievements that align with the job requirements.
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