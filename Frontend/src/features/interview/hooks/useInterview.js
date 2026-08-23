//Yeh humara hook hain joh humme help karega for finding connecting the api calls with frontend
import { generateInterviewReport, getAllReports, getInterviewReportById, generateresume as apiGenerateresume } from "../services/interview.api.js";
import { useContext, useEffect } from "react";
import { InterviewContext } from "../Interview.context.js";
import { useParams } from "react-router";
import { toast } from "react-hot-toast";

export const useInterview = () => {
  const { interviewId } = useParams(); //isse humme current url ka parameterized part milega
  //Abb humme yaahan context se info nikalkar leeni hain
  const context = useContext(InterviewContext);
  const { Loader, setLoader, report, setreport, reports, setreports } = context;
  //Abb humme yaahan fns likhne hain jo call karenge the functions of api
  async function generateReport({ selfDescription, jobDescription, resume }) {
    setLoader(true);
    try {
      const data = await generateInterviewReport({ jobDescription, selfDescription, resumeFile: resume });
      const interviewReport = data.interviewReport ?? data.report;
      // console.log("This is this : ", interviewReport);
      setreport(interviewReport);
      return interviewReport;
    }
    catch (err) {
      // console.log("Bhai daar maat");
      console.log(err);
      return false;

    }
    finally {
      setLoader(false);

    }
  }

  async function getReportbyID({ reportId }) {
    setLoader(true);
    try {
      const data = await getInterviewReportById(reportId);
      const interviewReport = data.interviewReport ?? data.report;
      setreport(interviewReport);
      return interviewReport;

    }
    catch (err) {
      // console.log("Bhai hum chalenge Saath !!!");
      console.log(err);
      return false;

    }
    finally {
      setLoader(false);

    }
  }

  useEffect(() => {
    if (!interviewId) return;//Iska meaning hain ki yeh interview report waala page nahi hain islye kuch na karo
    getReportbyID({ reportId: interviewId }); //Isse hum page refresh ka error ko hata diya hain
  }, [interviewId]);

  async function getallReports() {
    setLoader(true);
    try {
      const data = await getAllReports();
      return data;
      // setreports(data);
      // return true;
    }
    catch (err) {
      console.log(err);
      // return false;

    }
    finally {
      setLoader(false);

    }
  }

  async function generateresume(reportId) {
    // setLoader(true);
    toast(
      "Generating Resume, Please wait...",
      {
        duration: 6000,
      }
    );
    try {
      const blob = await apiGenerateresume(reportId);
      if (!blob) throw new Error("No file returned from server");
      const fileBlob = blob instanceof Blob ? blob : new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(fileBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume_${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }


  return { Loader, report, reports, generateReport, getallReports, getReportbyID, setreport, setreports, setLoader, generateresume };
}