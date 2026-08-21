import { useEffect, useState } from "react";
import { getAllReports } from "../services/interview.api.js";
import ReportModal from "./ReportModal";
import "./ReportFlashcards.scss";

export default function ReportFlashcards({ reports: initialReports }) {
  const [reports, setReports] = useState(initialReports || []);
  const [loading, setLoading] = useState(!initialReports);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!initialReports) {
      (async () => {
        try {
          setLoading(true);
          const data = await getAllReports();
          // backend might return an array or an object with `.reports`
          const arr = Array.isArray(data) ? data : data.reports || [];
          setReports(arr);
        } catch (err) {
          console.error("Failed to fetch reports", err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [initialReports]);

  if (loading) return <div className="rf-loading">Loading reports…</div>;
  if (!reports || reports.length === 0)
    return <div className="rf-empty">No reports found</div>;

  const formatDate = (s) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s;
    }
  };

  const truncate = (t, n = 140) =>
    t && t.length > n ? t.slice(0, n) + "…" : t;

  return (
    <div className="rf-container">
      {reports.map((r) => (
        <div className="rf-card" key={r._id} onClick={() => setSelected(r)}>
          <div className="rf-card-head">
            <h4 className="rf-title">
              {truncate(r.jobDescription ?? r.jobdescription)}
            </h4>
            <div className="rf-score">
              {typeof r.matchScore !== "undefined" ? `${r.matchScore}%` : "-"}
            </div>
          </div>
          <div className="rf-card-body">
            <div className="rf-meta">Generated: {formatDate(r.createdAt)}</div>
            {r.skillGaps && r.skillGaps.length > 0 && (
              <div className="rf-gaps">
                Skill gaps: {r.skillGaps.map((g) => g.skill).join(", ")}
              </div>
            )}
          </div>
        </div>
      ))}

      {selected && (
        <ReportModal report={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
