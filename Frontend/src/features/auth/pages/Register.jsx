import { useState } from "react";
import Loader from "../../../components/Loader";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/ThemeToggle.jsx";
import { toast } from "react-hot-toast";

function Register() {
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { loader, handleregister } = useAuth();
  const navigate = useNavigate(); //Isse hum navigate karenge user to other page
  async function handleSubmit(e) {
    e.preventDefault();
    const success = await handleregister({ username, email, password });
    if (success) {
      toast.success("Successfully Registered!");
      navigate("/");
    } else {
      toast.error("Registration failed. Please check your credentials.");
    }
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
        <h1>Welcome Sir 👋</h1>
        <p className="subtitle">Register to continue your coding journey.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="text">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your Username"
              onChange={(e) => {
                setusername(e.target.value);
              }}
            />
          </div>

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
            Register
          </button>
        </form>

        <p className="bottom-text">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </main>
  );
}

export default Register;
