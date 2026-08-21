//Abb humme yaahan iss component se pages ko protected banana hain
import { useAuth } from "../features/auth/hooks/useAuth";
import { Navigate } from "react-router";
import Loader from "./Loader";
function Protected({ children }) {
  const { loader, user } = useAuth();
  //Abb humme yahan check karna hain ki user exist toh karta hain na
  if (loader) {
    return <Loader />;
  }
  if (!user) {
    //Yaani user abhi login nahi kiya hua hain
    return <Navigate to={"/login"} replace />;
  }

  return children;
}
export default Protected;
