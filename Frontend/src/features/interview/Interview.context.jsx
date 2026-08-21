//Abb humme yaahan context create karna hain for the Interview feature
import { useState } from "react";
import { InterviewContext } from "./Interview.context.js";

export const InterviewContextProvider = ({ children }) => {
  const [Loader, setLoader] = useState(false);
  const [report, setreport] = useState(null);
  const [reports, setreports] = useState([]); //Yeh ek empty array hoga
  return (
    <InterviewContext.Provider
      value={{ Loader, setLoader, report, setreport, reports, setreports }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
