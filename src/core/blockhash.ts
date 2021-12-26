import abi from "./abi/blockhash.json";
import Web3 from "web3";
import BN from "bn.js";
const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const CONTRACT_ADDRESS = "0x3acA0af190BB423A27511CDad0Df77928ed377af";

export const getBlockHash = async (blockNumber: BN): Promise<string> =>
  new Promise(async (resolve) => {
    const BEP20 = new web3.eth.Contract(abi as any, CONTRACT_ADDRESS);

    resolve(await BEP20.methods.getBlockHash(blockNumber.toNumber()).call());
  });
