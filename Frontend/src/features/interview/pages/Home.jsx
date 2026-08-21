import { useState, useRef, useEffect } from "react";
import "../Home.scss";
import ThemeToggle from "../../../components/ThemeToggle.jsx";
import Loader from "../../../components/Loader.jsx";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { LiaUserSecretSolid } from "react-icons/lia";
import GetReports from "./GetReports.jsx";

function Home() {
  const [pastreport, setpastreport] = useState(null);

  const navigate = useNavigate();

  const { Loader: isLoading, generateReport, getallReports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const resumeRef = useRef(null);
  const handleJobChange = (event) => setJobDescription(event.target.value);
  const handleSelfChange = (event) => setSelfDescription(event.target.value);
  //Humme yaahan user ko uske past 5 reports show karne hain
  useEffect(() => {
    //Yaahan humme user ke liye uske past 5 recordss ko fetch karna hain
    async function fetchReports() {
      setpastreport(await getallReports());
      // console.log(response);
    }
    fetchReports();
    //Abb humme iss report ko send karna hain to the GetReport
  }, []);
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    resumeRef.current = file || null; //Yaani aagar file exist kare toh hi isme store kar deena
    setResumeName(file ? file.name : "");
  };
  const handleSubmit = async () => {
    //Abb humme yaahan check karke aage send karna hain
    if (!jobDescription) {
      alert("Job description is must !!!");
      return;
    }
    if (!selfDescription || !resumeName) {
      alert("Please Insert Your Self_Description or Ur Resume ...");
      return;
    }
    //Abb humme report generate karni hain report ko jo milegi fn se humme
    const reportGenerated = await generateReport({
      jobDescription,
      selfDescription,
      resume: resumeRef.current,
    });

    if (reportGenerated && reportGenerated._id) {
      navigate(`/interview/${reportGenerated._id}`);
      return;

    }

    // generateReport() failed (it returns false on error) — nothing to navigate to.
    alert(
      "Something went wrong while generating the report. Please try again.",
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="home">
      <div className="home__background">
        <div className="home__blob home__blob--one"></div>
        <div className="home__blob home__blob--two"></div>
      </div>
      <header className="page-header">
        <div className="page-header-nav">
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
        <p className="page-label">Create Your Custom Interview Plan</p>
        <h1>
          Build a <span>winning</span> strategy
        </h1>
        <p className="page-copy">
          Let our AI analyze the job requirements and your unique profile to
          create a fully personalized interview plan.
        </p>
      </header>
      <section className="interview-card">
        <div className="card-grid">
          <article className="panel panel--left">
            <div className="panel__heading">
              <div className="heading-left">
                <span className="heading-icon">▣</span>
                <div>
                  <p className="panel-label">Target Job Description</p>
                  <h2>Job Requirements</h2>
                </div>
              </div>
              <span className="status-badge">REQUIRED</span>
            </div>

            <div className="panel__body">
              <textarea
                value={jobDescription}
                onChange={handleJobChange}
                placeholder={`Paste the full job description here...\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design..."`}
                maxLength={5000}
              />
              <div className="panel__info">
                <span>{jobDescription.length} / 5000 chars</span>
              </div>
            </div>
          </article>

          <article className="panel panel--right">
            <div className="panel__heading">
              <div className="heading-left">
                <span className="heading-icon">♙</span>
                <div>
                  <p className="panel-label">Your Profile</p>
                  <h2>Resume or Self Description</h2>
                </div>
              </div>
            </div>

            <div className="panel__body profile-panel">
              <div className="upload-card">
                <div className="upload-title-row">
                  <span>Upload Resume</span>
                  <span className="best-badge">BEST RESULTS</span>
                </div>
                <label className="upload-box">
                  <div className="upload-icon">↑</div>
                  <strong>
                    {resumeName || "Click to upload or drag & drop"}
                  </strong>
                  <span>
                    {resumeName ? resumeName : "PDF or DOCX (Max 5MB)"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="or-divider">
                <span></span>
                <p>OR</p>
                <span></span>
              </div>

              <div className="self-description">
                <label htmlFor="selfDescription">Quick Self-Description</label>
                <textarea
                  id="selfDescription"
                  value={selfDescription}
                  onChange={handleSelfChange}
                  placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                />
              </div>

              <div className="note-box">
                <span className="note-icon">i</span>
                <p>
                  Either a <strong>Resume</strong> or{" "}
                  <strong>Self Description</strong> is required to generate a
                  personalized plan.
                </p>
              </div>
            </div>
          </article>
        </div>

        <div className="card-footer">
          <span className="speed-note">
            AI-Powered Strategy Generation · Approx 30s
          </span>
          <button
            type="button"
            className="generate-button"
            onClick={() => {
              handleSubmit();
            }}
          >
            <span>★</span>
            Generate My Interview Strategy
          </button>
        </div>
      </section>
      <GetReports response={pastreport} />
      
    </main>
  );
}

export default Home;
