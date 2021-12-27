import abi from "./abi/design.json";
import BN from "bn.js";
import Web3 from "web3";
import { AbiItem, toBN } from "web3-utils";

const CONTRACT_ADDRESS = "0x516e792268416c58b82565cef088cfb9575a750a";

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

export const designContract = new web3.eth.Contract(
  abi as AbiItem[],
  CONTRACT_ADDRESS
);

export const getUpgradeCost = async (
  rarity: any,
  level: any
): Promise<string> => {
  return new BN(
    await designContract.methods
      .getUpgradeCost(toBN(rarity), toBN(level))
      .call()
  ).toString();
};

export const getUpgradeCosts = async () => {
  return await designContract.methods.getUpgradeCosts().call();
};
