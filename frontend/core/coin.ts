import abi from "./abi/bcoin.json";
import Web3 from "web3";
import { AbiItem, toBN, toWei } from "web3-utils";

const CONTRACT_ADDRESS = "0x00e1656e45f18ec6747F5a8496Fd39B50b38396D";
const BHERO_ADDRESS = "0x30cc0553f6fa1faf6d7847891b9b36eb559dc618";

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");
const contract = new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

export const increaseAllowance = async (
  userAddress: any,
  address: any,
  amount: any
) => {
  const wei = toWei(`${amount}`);

  await new Promise((resolve, reject) => {
    contract.methods
      .increaseAllowance(address, wei.toString())
      .send({
        from: userAddress,
      })
      .on("confirmation", (confirmationNumber: any, receipt: any) => {
        console.log("receipt: ", receipt);

        if (confirmationNumber >= 6) {
          resolve(true);
        }
      })
      .on("error", (ex: any) => {
        reject(ex);
      });
  });
};

const _getAllowance = async (owner: any, spender: any) => {
  return await contract.methods.allowance(owner, spender).call();
};

const getAllowance = async (userAddress: any, address: any) => {
  return await _getAllowance(userAddress, address);
};

export const checkBCOINAllowance = async (userAddress: any, amount: string) => {
  const allowance = await getAllowance(userAddress, BHERO_ADDRESS);

  const amountBN = toBN(amount);
  const allowanceBN = toBN(allowance);

  if (amountBN.lte(allowanceBN)) {
    return;
  }

  const multiplier = toBN(10);

  await increaseAllowance(userAddress, BHERO_ADDRESS, amountBN.mul(multiplier));
};
