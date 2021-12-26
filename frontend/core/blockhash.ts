import * as RLP from "rlp";
import Web3 from "web3";
import BN from "bn.js";
import abi from "./abi/blockhash.json";
import { AbiItem, hexToBytes } from "web3-utils";
import { utils } from "ethers";

const CONTRACT_ADDRESS = "0x3acA0af190BB423A27511CDad0Df77928ed377af";
const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const contract = new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

const { keccak256 } = web3.utils;

export const bytes32ToBN = (bytes32str: string) =>
  new BN(hexToBytes(bytes32str));

export const getBlockHash = async (blockNumber: BN): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(
        await contract.methods.getBlockHash(blockNumber.toString()).call()
      );
    } catch (e) {
      reject(e);
    }
  });

export const getCurrentBlockTimestamp = (): Promise<string> =>
  new Promise(async (resolve, reject) => {
    try {
      resolve(await contract.methods.getCurrentBlockTimestamp().call());
    } catch (e) {
      reject(e);
    }
  });

export const toBlockNumber = (blockNumber: number) => new BN(blockNumber);

export const getBlock = async (blockNumber: number) =>
  await web3.eth.getBlock(blockNumber);

export const calculateBlockHash = async (blockNumber: number) => {
  const result = await web3.eth.getBlock(blockNumber);

  // It should return this when the block is too far in the future.
  if (!result)
    return "0x0000000000000000000000000000000000000000000000000000000000000000";

  const {
    parentHash,
    miner,
    sha3Uncles,
    stateRoot,
    gasLimit,
    gasUsed,
    timestamp,
    difficulty,
    number,
    receiptsRoot,
    logsBloom,
    extraData,
    nonce,
  } = result;

  const mixHash = (result as any).mixHash;
  const transactionsRoot = (result as any).transactionsRoot;

  const headers = [
    parentHash,
    sha3Uncles,
    miner,
    stateRoot,
    transactionsRoot,
    receiptsRoot,
    logsBloom,
    web3.utils.toHex(difficulty),
    web3.utils.toHex(number),
    web3.utils.toHex(gasLimit),
    gasUsed > 0 ? web3.utils.toHex(gasUsed) : "0x",
    web3.utils.toHex(timestamp),
    extraData,
    mixHash,
    nonce,
  ];

  let encoded = RLP.encode(headers);

  return keccak256(`0x${encoded.toString("hex")}`);
};
