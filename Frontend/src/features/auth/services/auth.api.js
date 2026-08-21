//Humme yaahan abb frontend and backend main ke beech ke connection ko yaaha set karna hain
import axios from "axios";

//Common axios instance with a timeout so a hung backend request fails
//after 10s instead of hanging the loader forever.
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "https://careerforge-ai-backend-cc9f.onrender.com"}/api/auth`,
  withCredentials: true,
  timeout: 10000,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/register", { username, email, password });
    return response.data;
  }
  catch (err) {
    console.log(err);
    throw err; // let callers (useAuth) know it actually failed
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.post("/logout", {});
    return response.data;
  }
  catch (err) {
    console.log(err);
    throw err;
  }
}

export async function get_me() {
  try {
    const response = await api.get("/get-me");
    return response.data;
  }
  catch (err) {
    console.log(err);
    return null;
  }
}