import ReportCard from "./ReportCard";
import Loader from "../../../components/Loader";
import "./GetReports.scss";
function formatIndianDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
function GetReports({ response }) {
  if (!response) {
    return <Loader />;
  }

  return (
    <main className="reports-page">
      <header className="reports-page__header">
        <p className="reports-page__label">Your history</p>
        <h1>Past interview reports</h1>
        <p className="reports-page__description">
          Review your latest scores and keep track of your progress.
        </p>
      </header>
      {response.data.Reports.length > 0 ? (
        <section className="reports-list" aria-label="Past interview reports">
          {response.data.Reports.map((value) => {
            return (
              <ReportCard
                key={value._id}
                report_id={value._id}
                score={value.matchScore}
                date={formatIndianDate(value.createdAt)}
              />
            );
          })}
        </section>
      ) : (
        <p className="reports-page__empty">No reports found yet.</p>
      )}
    </main>
  );
}

export default GetReports;
