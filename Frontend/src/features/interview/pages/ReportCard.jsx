import "./ReportCard.scss";
import { useNavigate } from "react-router";
import { useInterview } from "../hooks/useInterview";
function ReportCard({ report_id, score, date }) {
  const { getReportbyID } = useInterview();
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0));
  const navigate = useNavigate();
  function hanldeSubmit() {
    //Abb humme yaahan jab bhi user report ko click karega usse redirect karna hain uss report page pe
    getReportbyID({ reportId: report_id });
    navigate(`/interview/${report_id}`);
    //Abb humme redirect karwaana hain user ko yaahan se
  }
  //Abb humme yaahan feature add karna hain ki user uski report ko deekh paaye
  return (
    <article className="report-card" onClick={hanldeSubmit}>
      <div
        className="report-card__score-ring"
        style={{ "--score-progress": `${numericScore}%` }}
        aria-label={`Score: ${numericScore}%`}
      >
        <span className="report-card__score">{numericScore}%</span>
      </div>
      <div className="report-card__details">
        <p className="report-card__eyebrow">Interview report</p>
        <time className="report-card__date">{date}</time>
      </div>
    </article>
  );
}
export default ReportCard;
