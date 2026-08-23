import { useMemo, useState } from "react";
import "./InterviewReport.scss";
import ThemeToggle from "../../../components/ThemeToggle.jsx";
import Loader from "../../../components/Loader.jsx";
import { useInterview } from "../hooks/useInterview.js";
import { LiaUserSecretSolid } from "react-icons/lia";
import { useNavigate } from "react-router";
import { RiAiGenerate2 } from "react-icons/ri";
/* eslint-disable no-useless-escape */
// eslint-disable-next-line no-unused-vars
const sampleReport = {
  _id: "6a7819ef841cc0ed87ea9fb2",
  jobDescription:
    "Software Development Engineer Intern\n\nWe are looking for a motivated Software Development Engineer Intern to join our engineering team and contribute to the development of scalable and reliable software applications.\n\nResponsibilities\n\nDesign, develop, test, and maintain web applications and backend services.\nBuild and consume RESTful APIs.\nWork with frontend technologies such as React.js, HTML, CSS, and JavaScript.\nDevelop backend services using Node.js and Express.js.\nWork with databases such as MongoDB and PostgreSQL.\nWrite clean, maintainable, and well-documented code.\nDebug existing applications and identify performance and reliability issues.\nParticipate in code reviews and collaborate with other developers.\nWrite unit and integration tests for application features.\nWork with Git and GitHub for version control.\nParticipate in technical discussions and contribute to software architecture decisions.\nLearn and apply software engineering best practices.\n\nRequired Qualifications\n\nCurrently pursuing a Bachelor\'s degree in Computer Science, Information Technology, or a related field.\nStrong understanding of data structures and algorithms.\nGood knowledge of JavaScript and modern web development.\nExperience with React.js and Node.js.\nUnderstanding of REST APIs and backend development.\nExperience with at least one database such as MongoDB, MySQL, or PostgreSQL.\nFamiliarity with Git and version control.\nGood understanding of object-oriented programming.\nStrong analytical and problem-solving skills.\n\nPreferred Qualifications\n\nExperience with TypeScript.\nFamiliarity with Docker and containerization.\nBasic knowledge of AWS or another cloud platform.\nUnderstanding of CI/CD pipelines.\nExperience writing automated tests using tools such as Jest or similar frameworks.\nFamiliarity with Redis or other caching technologies.\nBasic understanding of system design and scalable backend architectures.\nExperience working with AI APIs or integrating AI-powered features into applications.\n\nSoft Skills\n\nStrong communication and collaboration skills.\nAbility to work effectively in a team.\nWillingness to learn new technologies.\nAbility to take ownership of assigned tasks.\nGood debugging and problem-solving abilities.",
  resume:
    "Aryan Sharma\nSoftware Developer | Full-Stack Developer\nProfessional Summary\nMotivated Information Technology student with strong foundations in data\nstructures, algorithms, database management, and web development.\nExperienced in building full-stack applications using React, Node.js,\nExpress, and MongoDB. Comfortable working with REST APIs, authentication,\nand Git-based development. Strong problem-solving skills with hands-on\nexperience in competitive programming and software development projects.\nEducation\nBachelor of Technology in Information Technology\nXYZ Institute of Technology, Pune\n2024 – 2028\nCGPA: 9.4/10\nTechnical Skills\nProgramming Languages: C++, JavaScript, Java, Python\nFrontend: HTML, CSS, JavaScript, React.js, Bootstrap\nBackend: Node.js, Express.js, REST APIs\nDatabases: MongoDB, MySQL\nTools: Git, GitHub, VS Code, Postman\nCore Computer Science: Data Structures and Algorithms, DBMS, OOP, Computer\nNetworks, Operating Systems\nProjects\nResume Builder & Interview Preparation Platform\nDeveloped a MERN-based web application that allows users to create and\nmanage professional resumes.\nImplemented user authentication using JWT and bcrypt.\nBuilt REST APIs using Node.js and Express.js.\nUsed MongoDB and Mongoose for storing user and resume information.\nIntegrated an AI-based interview preparation feature that analyzes a\nuser\'s resume and job description.\nDesigned the system to generate technical questions, identify skill gaps,\nand create personalized preparation plans.\n\n-- 1 of 2 --\n\nContest Tracker\nDeveloped a React-based platform for tracking upcoming programming\ncontests from Codeforces and other competitive programming platforms.\nIntegrated external APIs to retrieve contest information.\nImplemented filtering and sorting of contests based on their status and\nstart time.\nAdded bookmarking functionality for contests users want to participate in.\nPersonal Finance Tracker\nDeveloped a web application for tracking income and expenses.\nUsed PHP and MySQL for backend data management.\nImplemented CRUD operations for financial transactions.\nDesigned database tables to store and retrieve user financial records.\nAchievements\nStrong performance in competitive programming and data structures and\nalgorithms.\nSolved numerous problems involving arrays, strings, trees, graphs, dynamic\nprogramming, and binary search.\nParticipated in coding contests and technical competitions.\nOther Skills\nProblem solving\nAnalytical thinking\nTeam collaboration\nCommunication\nDebugging and troubleshooting\nAbility to learn new technologies quickly\n\n-- 2 of 2 --\n",
  selfDescription:
    "I am an Information Technology student who is passionate about software development and problem solving. I enjoy understanding how systems work internally and building applications that solve practical problems.\n\nMy strongest areas are data structures and algorithms, C++, JavaScript, React, Node.js, Express, MongoDB, and SQL. I have experience developing full-stack applications and working with REST APIs, authentication, databases, and third-party APIs.\n\nI particularly enjoy backend development and problem solving, but I am also comfortable working on frontend applications using React. I have been actively improving my knowledge of core computer science subjects such as DBMS, operating systems, computer networks, and object-oriented programming.\n\nI am looking for a software engineering internship or entry-level software development role where I can apply my problem-solving skills, work on real-world applications, learn from experienced developers, and contribute to a collaborative engineering team.\n\nOne of my current goals is to strengthen my knowledge of system design, cloud technologies, testing, and production-level software development.",
  matchScore: 85,
  technicalQuestions: [
    {
      question:
        "Explain the concept of Middleware in Express.js and how you would implement authentication using it.",
      intent:
        "Verify understanding of backend architecture and security practices like JWT.",
      answer:
        "Middleware functions have access to the request and response objects. Explain how to create a custom function to verify a JWT token in the request header, call next() if valid, or return a 401 error if not.",
    },
    {
      question:
        "How would you handle asynchronous operations in React to prevent state update errors on unmounted components?",
      intent:
        "Test knowledge of React lifecycle and handling API requests effectively.",
      answer:
        "Mention using useEffect cleanup functions, AbortController to cancel ongoing requests, or using state flags to track component mounting status.",
    },
    {
      question:
        "Describe the difference between SQL and NoSQL databases and when you would choose MongoDB over PostgreSQL.",
      intent:
        "Assess database knowledge and ability to make architectural decisions.",
      answer:
        "Focus on schema flexibility vs. strict structure, ACID compliance, and scalability. Choose MongoDB for rapid prototyping or unstructured data, PostgreSQL for complex relational queries.",
    },
  ],
  behavioralQuestions: [
    {
      question:
        "Tell me about a challenging technical problem you faced in a project and how you resolved it.",
      intent:
        "Gauge problem-solving process, persistence, and technical depth.",
      answer:
        "Use the STAR method (Situation, Task, Action, Result). Describe a specific bug or architectural hurdle, the steps taken to debug, and what was learned.",
    },
    {
      question:
        "How do you handle feedback during a code review when you disagree with a suggestion?",
      intent:
        "Evaluate collaboration, communication, and professional maturity.",
      answer:
        "Emphasize being open-minded, asking clarifying questions, providing evidence for your approach, and ultimately prioritizing the team's agreed-upon standards.",
    },
  ],
  skillGaps: [
    { skill: "TypeScript", severity: "Medium" },
    { skill: "Automated Testing (Jest/Cypress)", severity: "High" },
    { skill: "Cloud Basics (AWS/Docker)", severity: "Medium" },
    { skill: "CI/CD Pipelines", severity: "Low" },
  ],
  preparationPlan: [
    {
      day: 1,
      focus: "Automated Testing",
      tasks: [
        "Learn the basics of Jest for Node.js",
        "Write unit tests for a controller in your Resume Builder project",
      ],
      _id: "6a7819ef841cc0ed87ea9fb3",
    },
    {
      day: 2,
      focus: "TypeScript Migration",
      tasks: [
        "Review TypeScript documentation",
        "Convert a small utility file in a project from JS to TS",
      ],
      _id: "6a7819ef841cc0ed87ea9fb4",
    },
    {
      day: 3,
      focus: "System Design Basics",
      tasks: [
        "Study horizontal vs vertical scaling",
        "Understand Load Balancing and Caching concepts",
      ],
      _id: "6a7819ef841cc0ed87ea9fb5",
    },
    {
      day: 4,
      focus: "Docker & Containerization",
      tasks: [
        "Create a Dockerfile for a Node.js application",
        "Learn how to containerize a MongoDB instance",
      ],
      _id: "6a7819ef841cc0ed87ea9fb6",
    },
    {
      day: 5,
      focus: "Database Optimization",
      tasks: [
        "Study database indexing strategies in MongoDB",
        "Compare PostgreSQL and MongoDB specifically for schema design",
      ],
      _id: "6a7819ef841cc0ed87ea9fb7",
    },
    {
      day: 6,
      focus: "Mock Interviews & Soft Skills",
      tasks: [
        "Practice answering technical questions aloud",
        "Prepare stories for common behavioral questions using the STAR method",
      ],
      _id: "6a7819ef841cc0ed87ea9fb8",
    },
    {
      day: 7,
      focus: "Review & Final Polish",
      tasks: [
        "Review Git best practices and branching strategies",
        "Final code cleanup of GitHub projects to ensure they are clean and well-documented",
      ],
      _id: "6a7819ef841cc0ed87ea9fb9",
    },
  ],
};

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical Questions" },
  { id: "behavioral", label: "Behavioral Questions" },
  { id: "plan", label: "Prep Plan" },
];

function InterviewReport({ report: propReport }) {
  //Humma yaahan use karna hain useEffect ka jisse hum rehydrate kar paaye jab bhi user refresh kare

  const {
    report: contextReport,
    Loader: isLoading,
    generateresume,
  } = useInterview();
  const source = propReport ?? contextReport;
  function downloadResume() {
    console.log("This is the source : ", source);
    if (!source?.resume) {
      alert("No resume available to download.");
      return;
    } else {
      generateresume(source._id);
    }
  }
  const reportData = useMemo(() => {
    if (!source) return null;
    const normalizeArray = (value) => (Array.isArray(value) ? value : []);
    const asText = (value) => (typeof value === "string" ? value : "");

    return {
      ...source,
      jobDescription: asText(
        source.jobDescription ?? source.jobdescription ?? source.job_desc,
      ),
      selfDescription: asText(
        source.selfDescription ?? source.selfdescription ?? source.self_desc,
      ),
      resume: asText(source.resume),
      matchScore: source.matchScore ?? source.match_score,
      technicalQuestions: normalizeArray(source.technicalQuestions),
      behavioralQuestions: normalizeArray(source.behavioralQuestions),
      skillGaps: normalizeArray(source.skillGaps),
      preparationPlan: normalizeArray(
        source.preparationPlan ?? source.preparationplan,
      ),
    };
  }, [contextReport, propReport]);

  const [activeTab, setActiveTab] = useState("overview");
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [openBehaviorIndex, setOpenBehaviorIndex] = useState(null);
  const navigate = useNavigate();

  // All hooks that derive values from reportData MUST run on every render,
  // even while reportData is still null (loading). Guard *inside* the hook,
  // never skip the hook call itself with an early return above it.
  const displayJobDescription = reportData?.jobDescription || "";
  const displaySelfDescription = reportData?.selfDescription || "";

  const jobParagraphs = useMemo(() => {
    if (!displayJobDescription) return [];
    return displayJobDescription.split("\n\n").filter(Boolean);
  }, [displayJobDescription]);

  const resumePreview = useMemo(() => {
    if (!reportData?.resume) return "";
    return reportData.resume
      .split("\n\n")
      .filter(Boolean)
      .slice(0, 3)
      .join("\n\n");
  }, [reportData]);

  const reportTitle = useMemo(() => {
    if (!displayJobDescription) return "Interview report";
    return (
      displayJobDescription
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean) || "Interview report"
    );
  }, [displayJobDescription]);

  const quickFacts = useMemo(() => {
    if (!reportData) return [];
    const jobTitle =
      reportTitle !== "Interview report" ? reportTitle : "Custom role";
    const topSkills = reportData.skillGaps
      .slice(0, 2)
      .map((gap) => gap.skill)
      .filter(Boolean);
    const coreStack = reportData.resume
      ? reportData.resume.match(
          /React|Node|MongoDB|Express|JavaScript|TypeScript/i,
        )?.[0] || "Full stack"
      : "Full stack";

    return [
      { label: "Job type", value: jobTitle },
      { label: "Core stack", value: coreStack },
      { label: "Top gap", value: topSkills[0] || "Based on report" },
    ];
  }, [reportData, reportTitle]);

  // Early returns come AFTER every hook call above, never before.
  if (isLoading) {
    return <Loader />;
  }

  if (!reportData) {
    return (
      <main className="report-page">
        <header className="report-header">
          <div>
            <p className="report-subtitle">Interview Report</p>
            <h1>Loading report...</h1>
          </div>
          <ThemeToggle />
        </header>
      </main>
    );
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== "technical") {
      setOpenQuestionIndex(null);
    }
    if (tabId !== "behavioral") {
      setOpenBehaviorIndex(null);
    }
  };

  const toggleTechnical = (index) => {
    setOpenQuestionIndex((current) => (current === index ? null : index));
  };

  const toggleBehavioral = (index) => {
    setOpenBehaviorIndex((current) => (current === index ? null : index));
  };

  const hasAnyReportContent = Boolean(
    displayJobDescription ||
    displaySelfDescription ||
    reportData.resume ||
    reportData.technicalQuestions.length ||
    reportData.behavioralQuestions.length ||
    reportData.skillGaps.length ||
    reportData.preparationPlan.length,
  );

  if (!hasAnyReportContent) {
    return (
      <main className="report-page">
        <header className="report-header">
          <div>
            <p className="report-subtitle">Interview Report</p>
            <h1>No report data available yet</h1>
          </div>
          <ThemeToggle />
        </header>
      </main>
    );
  }
  const scoreClass =
    reportData.matchScore >= 80
      ? "high"
      : reportData.matchScore >= 60
        ? "medium"
        : "low";
  return (
    <main className="report-page">
      <header className="report-header">
        <div>
          <p className="report-subtitle">Interview Report</p>
          <h1>Personalized preparation dashboard</h1>
        </div>

        <div className="report-header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="logout-button"
            aria-label="User info"
            data-tooltip="User info"
            onClick={() => {
              navigate("/logout");
            }}
          >
            <LiaUserSecretSolid aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="report-layout">
        <aside className="report-sidebar">
          <div className="sidebar-card">
            <p className="card-title">Review sections</p>
            <div className="sidebar-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-card sidebar-card--highlight">
            <p className="card-title">Quick facts</p>
            {quickFacts.map((fact) => (
              <div key={fact.label} className="fact-row">
                <span>{fact.label}</span>
                <strong>{fact.value}</strong>
              </div>
            ))}
          </div>
          <div className="sidebar-action-wrap">
            <button
              type="button"
              className="sidebar-action"
              onClick={downloadResume}
            >
              <RiAiGenerate2 />
              Generate Resume
            </button>
          </div>
        </aside>

        <section className="report-main">
          <div className="overview-card">
            <div className="overview-intro">
              <p className="section-label">Job description</p>
              <h2>{reportTitle}</h2>
            </div>
            <p className="overview-copy">
              This report connects the role requirements with the candidate's
              resume, self-description, and recommended preparation plan.
            </p>
          </div>

          {activeTab === "overview" && (
            <div className="content-card">
              <div className="content-row">
                <div>
                  <p className="section-label">Top resume summary</p>
                  <pre className="text-block">{resumePreview}</pre>
                </div>
                <div>
                  <p className="section-label">Self introduction</p>
                  <p className="text-block">{displaySelfDescription}</p>
                </div>
              </div>
              <div>
                <p className="section-label">Role requirements</p>
                {jobParagraphs.map((paragraph, index) => (
                  <p className="text-block" key={index}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {activeTab === "technical" && (
            <div className="content-card">
              <p className="section-label">Technical questions</p>
              <div className="qa-list">
                {reportData.technicalQuestions.map((item, index) => {
                  const open = openQuestionIndex === index;
                  return (
                    <article
                      key={index}
                      className={`qa-item ${open ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="qa-summary"
                        onClick={() => toggleTechnical(index)}
                      >
                        <span>{item.question}</span>
                        <span className="qa-toggle-icon">
                          {open ? "−" : "+"}
                        </span>
                      </button>
                      {open && (
                        <div className="qa-details">
                          <p className="intent">Intent: {item.intent}</p>
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "behavioral" && (
            <div className="content-card">
              <p className="section-label">Behavioral questions</p>
              <div className="qa-list">
                {reportData.behavioralQuestions.map((item, index) => {
                  const open = openBehaviorIndex === index;
                  return (
                    <article
                      key={index}
                      className={`qa-item ${open ? "open" : ""}`}
                    >
                      <button
                        type="button"
                        className="qa-summary"
                        onClick={() => toggleBehavioral(index)}
                      >
                        <span>{item.question}</span>
                        <span className="qa-toggle-icon">
                          {open ? "−" : "+"}
                        </span>
                      </button>
                      {open && (
                        <div className="qa-details">
                          <p className="intent">Intent: {item.intent}</p>
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div className="content-card">
              <p className="section-label">7-day preparation plan</p>
              <div className="plan-list">
                {reportData.preparationPlan.map((item, index) => {
                  const tasks = Array.isArray(item?.tasks) ? item.tasks : [];
                  return (
                    <div key={item?._id ?? index} className="plan-card">
                      <div className="plan-header">
                        <span>Day {item?.day ?? index + 1}</span>
                        <strong>{item?.focus ?? "Preparation focus"}</strong>
                      </div>
                      <ul>
                        {tasks.map((task, taskIndex) => (
                          <li key={taskIndex}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="report-aside">
          <div className="aside-card aside-card--score">
            <p className="card-title">Match score</p>
            <div className={`score-circle score--${scoreClass}`}>
              <span>{reportData.matchScore}</span>
            </div>
            <p className="score-copy">
              This score reflects how closely the profile matches the role.
            </p>
          </div>

          <div className="aside-card">
            <p className="card-title">Skill gaps</p>
            <div className="gaps-list">
              {reportData.skillGaps.map((gap) => (
                <div key={gap.skill} className="gap-item">
                  <span>{gap.skill}</span>
                  <strong
                    className={`severity severity--${gap.severity.toLowerCase()}`}
                  >
                    {gap.severity}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="aside-card aside-card--notes">
            <p className="card-title">Actionable insight</p>
            <p className="aside-copy">
              Prioritize the highest severity gaps first. Practice the suggested
              technical questions and use the prep plan to structure one week of
              improvement.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default InterviewReport;
