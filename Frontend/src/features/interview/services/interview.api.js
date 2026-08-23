//Humme yaahan saare interview ke related apis ko handle karna hain
import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://careerforge-ai-backend-cc9f.onrender.com",
  withCredentials: true,
  timeout: 20000,
});//For handling the interview related apis 

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function generateInterviewReport({ jobDescription, selfDescription, resumeFile }) {
  const formData = new FormData();
  formData.append("selfDescription", selfDescription);
  formData.append("jobDescription", jobDescription);
  formData.append("resume", resumeFile);
  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    timeout: 20000

  });
  // console.log(response.data.interviewReport);
  return response.data;
}

export async function getInterviewReportById(reportID) {
  //Abb humme yaahan ek particular reportID ko fetch karna hain
  const response = await api.get(`/api/interview/report/${reportID}`, {
    timeout: 20000
  });
  return response.data;
}

export async function getAllReports() {
  //Abb humme yaahan saare reports from server fetch karna hain
  // Backend endpoint expected: GET /api/interview/report
  const response = await api.get("/api/interview/report", {
    timeout: 20000
  });
  return response;//Isse humme saare reports mil jayenge for the specific user

}

export async function generateresume(interviewReportID) {
  //Abb humme yaaha resume banwaana hain
  const response = await api.get(`/api/interview/generateresume/${interviewReportID}`, {
    timeout: 110000,
    responseType: "blob",
  });
  return response.data;
}

