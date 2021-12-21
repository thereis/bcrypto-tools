import abi from "./abi.json";
import Web3 from "web3";
import BN from "bn.js";
const web3 = new Web3("https://bsc-dataseed1.binance.org:443");

const { toBN } = web3.utils;

const CONTRACT_ADDRESS = "0x3acA0af190BB423A27511CDad0Df77928ed377af";

// const getBlockHash
