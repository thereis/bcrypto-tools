import "../styles/flowbite.css";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import useDarkMode from "../src/shared/hooks/dark-theme";

import Web3 from "web3";

function getLibrary(provider: any) {
  return new Web3(provider);
}

import { Web3ReactProvider } from "@web3-react/core";
import { MetaMaskProvider } from "../src/shared/hooks/use-metamask";

function MyApp({ Component, pageProps }: AppProps) {
  const { theme, setTheme } = useDarkMode();

  React.useEffect(() => {
    if (theme !== "dark") {
      setTheme("dark");
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <Component {...pageProps} />;
      </MetaMaskProvider>
    </Web3ReactProvider>
  );
}
export default MyApp;
