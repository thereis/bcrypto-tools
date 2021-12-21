import Web3 from "web3";
import * as RLP from "rlp";
import BN from "bn.js";

const { keccak256 } = Web3.utils;

const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

export const getBlock = async (blockNumber: number) =>
  await web3.eth.getBlock(blockNumber);

export const getCounter = async () => {};

export const getBlockHash = async (blockNumber: number) => {
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
