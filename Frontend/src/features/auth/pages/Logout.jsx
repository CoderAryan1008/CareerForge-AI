//humme yaahan logout feature provide karna hain users ke liye
import { useAuth } from "../hooks/useAuth.js";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/ThemeToggle.jsx";
import Loader from "../../../components/Loader.jsx";
import "../auth.form.scss";
import { IoLogOutOutline } from "react-icons/io5";
function Logout() {
  const { user, loader, handlelogout } = useAuth();
  const navigate = useNavigate();
  if (!user) {
    navigate("/login");
  }
  if (loader) {
    return <Loader />;
  }

  const initials = user.username.slice(0, 2).toUpperCase();

  const handleLogout = async () => {
    await handlelogout();
    navigate("/login");
  };

  return (
    <main className="auth-page profile-page">
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>

      <section className="profile-card" aria-labelledby="profile-title">
        <div className="profile-card__actions">
          <ThemeToggle />
        </div>

        <div className="profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <p className="profile-card__eyebrow">Account profile</p>
        <h1 id="profile-title">Welcome, {user.username}</h1>
        <p className="profile-card__subtitle">
          Here are the details linked to your account.
        </p>

        <div className="profile-details">
          <div className="profile-detail">
            <span className="profile-detail__label">Username</span>
            <strong>{user.username}</strong>
          </div>
          <div className="profile-detail">
            <span className="profile-detail__label">Email address</span>
            <strong>{user.email}</strong>
          </div>
        </div>

        <button type="button" className="primary-button" onClick={handleLogout}>
          Log out
          <IoLogOutOutline />
        </button>
      </section>
    </main>
  );
}
export default Logout;
