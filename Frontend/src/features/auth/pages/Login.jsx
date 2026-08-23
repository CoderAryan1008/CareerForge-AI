import { useState } from "react";
import "../auth.form.scss";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.js"; //Isse hum loader ko manage and login manage karenge
import Loader from "../../../components/Loader.jsx";
import ThemeToggle from "../../../components/ThemeToggle.jsx";
import { toast } from "react-hot-toast";
function Login() {
  const { loader, handlelogin } = useAuth();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    const success = await handlelogin({ email, password }); // <-- capture result
    if (success) {
      toast.success("Successfully Logined!");
      navigate("/");
    } else {
      toast.error("Login failed. Please check your credentials.");
    }
    // else: stay on the page — you should show an error here
  }

  if (loader) {
    return <Loader />;
  }
  return (
    <main className="auth-page">
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>

      <div className="form-container">
        <div className="page-actions">
          <ThemeToggle />
        </div>
        <h1>Welcome Back 👋</h1>
        <p className="subtitle">Login to continue your coding journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </div>

          <button type="submit" className="button primary-button">
            Login
          </button>
        </form>

        <p className="bottom-text">
          Don't have an account?{" "}
          <span
            onClick={() => {
              navigate("/register");
            }}
          >
            Register
          </span>
        </p>
      </div>
    </main>
  );
}

export default Login;
