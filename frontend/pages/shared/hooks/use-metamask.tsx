import React, { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Dependencies
 */
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";

type State = {
  isActive: boolean;
  account: string | null | undefined;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  shouldDisable: boolean;
  provider: Web3;
};

export const injected = new InjectedConnector({ supportedChainIds: [56] });
export const MetaMaskContext = React.createContext<State>({} as State);

const initialState: State = {
  isActive: false,
  account: undefined,
  isLoading: false,
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  shouldDisable: false,
  provider: new Web3(),
};

export const MetaMaskProvider: React.FC = ({ children }) => {
  const { activate, account, active, deactivate } = useWeb3React<Web3>();

  const [isActive, setIsActive] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false); // Should disable connect button while connecting to MetaMask
  const [isLoading, setIsLoading] = useState(true);
  const [provider, setProvider] = useState<Web3>(new Web3());

  // Init Loading
  useEffect(() => {
    connect().then((val) => {
      setIsLoading(false);
    });
  }, []);

  // Check when App is Connected or Disconnected to MetaMask
  const handleIsActive = useCallback(() => {
    console.log("App is connected with MetaMask ", active);
    if (!active || !account) return;

    let newProvider = new Web3((window as any).ethereum);
    newProvider.eth.defaultAccount = account;

    setIsActive(active);
    setProvider(newProvider);
  }, [active]);

  useEffect(() => {
    handleIsActive();
  }, [handleIsActive]);

  // Connect to MetaMask wallet
  const connect = async () => {
    console.log("Connecting to MetaMask...");
    setShouldDisable(true);
    try {
      await activate(injected).then(() => {
        setShouldDisable(false);
      });
    } catch (error) {
      console.log("Error on connecting: ", error);
    }
  };

  // Disconnect from Metamask wallet
  const disconnect = async () => {
    console.log("Disconnecting wallet from App...");
    try {
      await deactivate();
    } catch (error) {
      console.log("Error on disconnnect: ", error);
    }
  };

  const values: State = useMemo(
    () => ({
      isActive,
      account,
      isLoading,
      connect,
      disconnect,
      shouldDisable,
      provider,
    }),
    [isActive, isLoading, shouldDisable, account]
  );

  return (
    <MetaMaskContext.Provider value={{ ...initialState, ...values }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

export default function useMetaMask() {
  const context = React.useContext(MetaMaskContext);

  if (context === undefined) {
    throw new Error(
      "useMetaMask hook must be used with a MetaMaskProvider component"
    );
  }

  return context;
}
