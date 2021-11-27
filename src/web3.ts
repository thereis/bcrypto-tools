import Web3 from "web3";

import { Account, Sign } from "web3-core";

const PK = process.env.PK || null;

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const getAccountInstance = (): Promise<Account> =>
  new Promise((resolve) => {
    if (!PK) throw new Error("PK not defined");

    resolve(web3.eth.accounts.privateKeyToAccount(PK));
  });

export const getAccountAddress = () =>
  new Promise<string>(async (resolve, reject) => {
    try {
      const account = await getAccountInstance();

      resolve(account.address);
    } catch (e) {
      reject(e);
    }
  });

export const signRequest = (stringToSign: string) =>
  new Promise<Sign>(async (resolve, reject) => {
    try {
      const address = await getAccountInstance();

      resolve(address.sign(stringToSign));
    } catch (error) {}
  });
