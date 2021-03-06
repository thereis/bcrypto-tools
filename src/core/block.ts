import * as RLP from "rlp";
import Web3 from "web3";
import BN from "bn.js";
import abi from "./abi/blockhash.json";
import { AbiItem } from "web3-utils";

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const { keccak256 } = web3.utils;

const CONTRACT_ADDRESS = "0x3acA0af190BB423A27511CDad0Df77928ed377af";

export const getBlockHash = async (blockNumber: BN): Promise<string> =>
  new Promise(async (resolve) => {
    const BEP20 = new web3.eth.Contract(abi as AbiItem[], CONTRACT_ADDRESS);

    resolve(await BEP20.methods.getBlockHash(blockNumber.toNumber()).call());
  });

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
