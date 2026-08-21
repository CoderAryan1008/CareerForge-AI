import { useEffect, useState } from "react";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
const themes = {
  dark: "dark",
  light: "light",
};

function getInitialTheme() {
  if (typeof window === "undefined") {
    return themes.dark; //Yaani agar yeh browser ke alawa koi aur env hain toh by default waaha black theme apply kar dega
  }

  const saved = window.localStorage.getItem("theme");
  return saved === themes.light ? themes.light : themes.dark;
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem("theme", theme); //Abb humne windows ke local storage main bhi changes kar diye hain
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === themes.dark ? themes.light : themes.dark,
    );
  };

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Change the theme"
      data-tooltip="Change the theme"
    >
      {theme === themes.dark ? <CiLight /> : <MdDarkMode />}
    </button>
  );
}
