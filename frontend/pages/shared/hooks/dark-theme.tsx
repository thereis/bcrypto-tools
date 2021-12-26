import { useEffect, useState } from "react";

function useDarkMode() {
  const [theme, setTheme] = useState<string>(
    typeof window !== "undefined" ? localStorage.theme : "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove(theme);
    root.classList.add(theme);

    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return { theme, setTheme };
}

export default useDarkMode;
