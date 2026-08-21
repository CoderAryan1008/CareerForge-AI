// Abb humme yaaha ek context create karna hain jisse hum states ko single container se handle kar paaye
import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context.js";
import { get_me } from "./services/auth.api";
export const AuthProvider = ({ children }) => {
  //Abb isse hum data feed karenge in the context container
  const [user, setUser] = useState(null);
  const [loader, setloader] = useState(true);
  //Abb humme yaahan refresh cycles ke beech main bhi dhyan deena hain
  useEffect(() => {
    async function getAndsetUser() {
      try {
        const data = await get_me();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setloader(false);
      }
    }
    getAndsetUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loader, setloader }}>
      {children}
    </AuthContext.Provider>
  );
};
