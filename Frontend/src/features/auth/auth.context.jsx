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
    let isMounted = true;
    const loaderTimeout = window.setTimeout(() => {
      if (isMounted) {
        setUser(null);
        setloader(false);
      }
    }, 12000);

    async function getAndsetUser() {
      try {
        const data = await get_me();
        if (isMounted) {
          setUser(data?.user ?? null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setloader(false);
        }
        // Fetch finished (success or failure) — the failsafe timeout is no
        // longer needed, so cancel it to stop it from wiping the user state
        // out later.
        window.clearTimeout(loaderTimeout);
      }
    }
    getAndsetUser();

    return () => {
      isMounted = false;
      window.clearTimeout(loaderTimeout);
    };
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, loader, setloader }}>
      {children}
    </AuthContext.Provider>
  );
};