import "./ReportFlashcards.scss";

export default function ReportModal({ report, onClose }) {
  if (!report) return null;

  const {
    jobDescription,
    matchScore,
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
    createdAt,
  } = report;
  const displayJobDescription = jobDescription ?? report.jobdescription;

  const formatDate = (s) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  return (
    <div className="rf-modal-overlay" onClick={onClose}>
      <div className="rf-modal" onClick={(e) => e.stopPropagation()}>
        <button className="rf-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="rf-modal-inner">
          <h2 className="rf-modal-title">Report</h2>
          <div className="rf-meta-row">
            <div>
              <strong>Generated:</strong> {formatDate(createdAt)}
            </div>
            <div>
              <strong>Match Score:</strong>{" "}
              {typeof matchScore !== "undefined" ? `${matchScore}%` : "-"}
            </div>
          </div>

          <section>
            <h3>Job Description</h3>
            <pre className="rf-jobdesc">{displayJobDescription}</pre>
          </section>

          <section>
            <h3>Technical Questions</h3>
            <ul className="rf-list">
              {technicalQuestions.map((q, i) => (
                <li key={i}>
                  <strong>{q.question}</strong>
                  <div className="rf-intent">{q.intent}</div>
                  <div className="rf-answer">{q.answer}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Behavioral Questions</h3>
            <ul className="rf-list">
              {behavioralQuestions.map((q, i) => (
                <li key={i}>
                  <strong>{q.question}</strong>
                  <div className="rf-intent">{q.intent}</div>
                  <div className="rf-answer">{q.answer}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Skill Gaps</h3>
            <ul className="rf-list">
              {skillGaps.map((g, i) => (
                <li key={i}>
                  {g.skill} — {g.severity}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3>Preparation Plan</h3>
            <ol className="rf-plan">
              {preparationPlan.map((p, i) => (
                <li key={i}>
                  <strong>
                    Day {p.day} — {p.focus}
                  </strong>
                  {p.tasks && (
                    <ul>
                      {p.tasks.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
