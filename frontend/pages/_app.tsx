import "../styles/flowbite.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import useDarkMode from "../src/shared/hooks/dark-theme";

function MyApp({ Component, pageProps }: AppProps) {
  const { theme, setTheme } = useDarkMode();

  React.useEffect(() => {
    if (theme !== "dark") {
      setTheme("dark");
    }
  }, []);

  return <Component {...pageProps} />;
}
export default MyApp;
