import { createRoot } from "react-dom/client";
import "./style.scss";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./features/auth/pages/Login.jsx";
import Register from "./features/auth/pages/Register.jsx";
import { AuthProvider } from "./features/auth/auth.context.jsx";
import Protected from "./components/Protected.jsx";
import Home from "./features/interview/pages/Home.jsx";
import InterviewReport from "./features/interview/pages/InterviewReport.jsx";
import "./index.css";
import { InterviewContextProvider } from "./features/interview/Interview.context.jsx";
import { Toaster } from "react-hot-toast";
import Logout from "./features/auth/pages/Logout.jsx";
import GetReports from "./features/interview/pages/GetReports.jsx";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <Protected>
        <Home />
      </Protected>
    ),
  },
  {
    path: "/interview/:interviewId",
    element: (
      <Protected>
        <InterviewReport />
      </Protected>
    ),
  },
  {
    path: "/logout",
    element: (
      <Protected>
        <Logout />
      </Protected>
    ),
  },
  {
    path: "/reports",
    element: (
      <Protected>
        <GetReports />
      </Protected>
    ),
  },
]);
createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <InterviewContextProvider>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </InterviewContextProvider>
  </AuthProvider>,
);
