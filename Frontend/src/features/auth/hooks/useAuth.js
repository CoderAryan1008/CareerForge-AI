//Abb yaahan humme states and api call ko manage karna hain
import { useContext } from "react";
import { AuthContext } from "../auth.context.js";
import { login, register, logout } from "../services/auth.api.js"; //Humara api layer for connecting frontend and backend
export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loader, setloader } = context;

  async function handlelogin({ email, password }) {
    setloader(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true;                 // <-- signal success
    }
    catch (err) {
      console.log("Bhai dar maat main hu tere saath");
      console.log(err);
      return false;                // <-- signal failure
    }
    finally {
      setloader(false);
    }
  }

  async function handleregister({ email, password, username }) {
    setloader(true);
    try {
      const data = await register({ username, email, password });
      setUser(data.user);
      return true;                 // <-- signal success
    }
    catch (err) {
      console.log(err);
      return false;                // <-- signal failure
    }
    finally {
      setloader(false);
    }
  }

  async function handlelogout() {
    setloader(true);
    try {
      await logout();
      setUser(null);
    }
    catch (err) {
      console.log(err);
    }
    finally {
      setloader(false);
    }
  }

  return { user, loader, handlelogin, handlelogout, handleregister };
}